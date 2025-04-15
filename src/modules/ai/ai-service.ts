import { InjectConfig } from '@common/decorators/inject-config.decorator';
import { AIConfig, AIConfigType } from '@core/ai/ai.config';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechClient } from '@google-cloud/speech';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';

@Injectable({})
export class AIService {
  private geminiAI: GoogleGenerativeAI;
  private client: SpeechClient;

  constructor(
    @InjectConfig(AIConfig)
    private readonly AIConfig: AIConfigType,
    private readonly fileUploadService: FilesUploadService,
  ) {
    this.client = new SpeechClient();
    this.geminiAI = new GoogleGenerativeAI(this.AIConfig.AIApiKey);
  }

  /**
   * Make a request to ChatGPT / Gemini to generate a response based on a prompt.
   * @param prompt - The prompt for the ChatGPT / Gemini  model
   * @returns A string containing the generated response
   */
  async chatGptRequest(prompt: string): Promise<string> {
    try {
      const model = this.geminiAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          candidateCount: 1,
          maxOutputTokens: 500,
          temperature: 0.5,
        },
      });

      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (e) {
      // Log and propagate the error
      console.error(e);
      throw new ServiceUnavailableException('Failed request to ChatGPT');
    }
  }

  getWorkOrderSummary(data) {
    return `Here is the list of keywords that you will regularly see in your input JSON queries that are received from the backend. I want to make sure you understand, there are several words that may mean the same thing. However, user only understands one keyword. So when producing the output make sure, you only use the keyword that the user understands
Explanation for the Alectify CMMS Platform:
There is a Site, which has many asset categories. Each Asset Category, has multiple Assets. An Asset can be divided into a Parent Asset and a Sub Asset.  For Example, if Car is a Parent Asset, it can have multiple components such as Battery, seat cover, steering wheel and engine all of which would be classified as sub assets of a parent asset called Car.
Now, people perform different work orders on a Parent Asset or a sub Asset. If a work order does not correspond to either a Parent asset or a sub asset, then it is of Type “Generic”.
A Work Order is classified as Maintenance or Task. Maintenance can be further divided into Corrective Maintenance (CM) and Preventive Maintenance (PM).
When a work order is created it is in “Scheduled” state and the “Assignee” needs to work on it. Once the “Assignee” has completed the work, they perform the Action: “Submit For Review”. Th work order state then changes to “Waiting for Review”. Once, the work order is in “Waiting for Review” state, the “Approvers” need to take action on the work order and they will “Review and Close” the Task. The the work order will enter “Closed” State. A work order can also enter “Skip” state, if some one performs the action: “Skip”.
In the backend responses for a work order detail, which you will frequently receive as an input json. It is important for you to understand, “There are certain words that a user understands, and there are many backend variables which are used in the responses which correspond to the words usually used by the user.
Here is the following List. The first key on the left is the keyword that the user understands followed by the list of keywords that you will regularly see in the input files. Then there is another “:” symbol followed by the explanation of what these words mean.
Example,
user_keyword:  [backend_key_word1, backend_keyword2, … ]
Here is the list:
"Parent Asset": ["areas"],
"Sub Asset": ["assets"],
"Completion Date": ["CompletionAt"],
"Completed By": ["CompletedBy"],
"Completed At": ["CompletedAt"],
"Asset Category": ["subProject"],
"Work Order Title": ["workTitle"],
"First name": ["first_name"],
"Last name": ["last_name"],
"Site": ["project"],
"Maintenance": ["PM_EXTERNAL"],
"CM": ["CORRECTIVE_MAINTENANCE"],
"PM": ["PREVENTIVE_MAINTENANCE"],
"Scheduled": ["PENDING"],
The rest of the them, you should be able to infer on your own. Your task is to summarize a work order from the Alectify CMMS Platform.
Here is some context about the website:
There are many Asset Categories, with each having multiple Assets. An Asset can be divided into a Parent Asset and a Sub Asset.  For Example, if Car is a Parent Asset, it can have multiple components such as Battery, seat cover, steering wheel and engine all of which would be classified as sub assets of a parent asset called Car.
Now, people perform different work orders on a Parent Asset or a sub Asset. If a work order does not correspond to either a Parent asset or a sub asset, then it is of Type “Generic”.
A Work Order is classified as Maintenance or Task. Maintenance can be further divided into Corrective Maintenance (CM) and Preventive Maintenance (PM).
When a work order is created it is in “Scheduled” state and the “Assignee” needs to work on it. Once the “Assignee” has completed the work, they perform the Action: “Submit For Review”. Th work order state then changes to “Waiting for Review”. Once, the work order is in “Waiting for Review” state, the “Approvers” need to take action on the work order and they will “Review and Close” the Task. The the work order will enter “Closed” State. A work order can also enter “Skip” state, if some one performs the action: “Skip”.
In the backend responses for a work order detail, which you will frequently receive as an input json. It is important for you to understand, “There are certain words that a user understands, and there are many backend variables which are used in the responses which correspond to the words usually used by the user.
Here is the following List. The first key on the left is the keyword that the user understands followed by the list of keywords that you will regularly see in the input files. Then there is another “:” symbol followed by the explanation of what these words mean.
Here is the list:
Parent Asset: [areas]: The Car example, discussed earlier.
Sub Asset: [assets]: The engine example, discussed earlier
“Completion Date”: [CompletionAt]: This is the Date entered by the assignees when they submit for review
“Completed By”: [CompletedBy]: This key represents which Assignee, clicked on the action button: “Submit for Review”.
“Completed At”: [CompeletedAt] : This key represents the exact time when the Assignee, clicked on the action button: “Submit for Review”.
Asset Category: [subProject]
Work Order Title: [work_title]
Summarize the following work order information as a concise executive summary of a max
of 6 bullet points. make sure the output should be in html5 format without backticks or triple quotes. my frontend should be able to parse your output this is a absolutely necessary condition:
Details: ${JSON.stringify(data)}
The user can already see the important basic info on the portal such as work title,asset,site and priority. Include what
is unique. This can include messages between the employees or a delay that was not supposed to happen. Also should have enought of summary detail.
First bullet point: (type of maintenance) work order (code) (status) with a (priority)`;
  }

  // Convert any audio file to a mono LINEAR16 WAV format
  private async convertToWav(
    inputBuffer: Buffer,
    format: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const inputPath = path.join(__dirname, `input.${format}`);
      const outputPath = path.join(__dirname, 'output.wav');

      fs.writeFileSync(inputPath, inputBuffer);
      let sampleRate: number;
      ffmpeg(inputPath)
        .audioChannels(1) // Convert to mono
        .audioCodec('pcm_s16le') // Use LINEAR16 codec
        .toFormat('wav') // Output in WAV format
        .on('end', async () => {
          const outputBuffer = fs.readFileSync(outputPath);
          sampleRate = await this.getSampleRate(outputPath);
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          resolve([outputBuffer, sampleRate]);
        })
        .on('error', (err) => {
          console.error('Error during ffmpeg conversion:', err);
          reject(err);
        })
        .save(outputPath);
    });
  }

  private async getSampleRate(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const sampleRate = metadata.streams[0].sample_rate;
          resolve(parseInt(sampleRate, 10));
        }
      });
    });
  }

  async transcribeAudio(fileUrl: string, format: string) {
    const audioBuffer = await this.fileUploadService.getAudioBuffer(fileUrl);
    // Convert to wav if the file is stereo
    const wavAudio = await this.convertToWav(audioBuffer, format);
    console.log(
      'wavAudiowavAudio',
      Buffer.isBuffer(wavAudio[0]),
      wavAudio,
      audioBuffer,
    );

    const audio = {
      content: wavAudio[0].toString('base64'),
    };

    const config: any = {
      encoding: 'LINEAR16',
      sampleRateHertz: wavAudio[1] ?? 16000,
      languageCode: 'en-US',
    };

    const request = {
      audio: audio,
      config: config,
    };

    try {
      // Transcribe the audio
      const [response] = await this.client.recognize(request);

      // Extract the transcription text
      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');
      console.log('transcriptiontranscription', transcription);
      return transcription;
    } catch (error) {
      console.error(
        'Error during transcription:',
        error.details || error.message,
      );
      return null;
    }
  }
}
