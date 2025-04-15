import { PMTypes } from 'modules/preventive-maintenances/models/pm-types.enum';
import * as moment from 'moment';

export default class DefaultEmailTemplate {
  static get(content: string) {
    return `
        <!DOCTYPE html>
    <html>
      <head>
        <style type="text/css">
          @media screen {
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 400;
              src: local('Lato Regular'), local('Lato-Regular'),
                url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff)
                  format('woff');
            }
    
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 700;
              src: local('Lato Bold'), local('Lato-Bold'),
                url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff)
                  format('woff');
            }
    
            @font-face {
              font-family: 'Lato';
              font-style: italic;
              font-weight: 400;
              src: local('Lato Italic'), local('Lato-Italic'),
                url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff)
                  format('woff');
            }
    
            @font-face {
              font-family: 'Lato';
              font-style: italic;
              font-weight: 700;
              src: local('Lato Bold Italic'), local('Lato-BoldItalic'),
                url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff)
                  format('woff');
            }
          }
    
          /* CLIENT-SPECIFIC STYLES */
          body,
          table,
          td,
          a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
    
          table,
          td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
    
          img {
            -ms-interpolation-mode: bicubic;
          }
    
          /* RESET STYLES */
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
          }
    
          table {
            border-collapse: collapse !important;
          }
    
          body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
    
          /* iOS BLUE LINKS */
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
    
          /* MOBILE STYLES */
          @media screen and (max-width: 600px) {
            h1 {
              font-size: 32px !important;
              line-height: 32px !important;
            }
          }
    
          /* ANDROID CENTER FIX */
          div[style*='margin: 16px 0;'] {
            margin: 0 !important;
          }
        </style>
      </head>
    
      <body
        style="
          background-color: #f4f4f4;
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'Lato', Helvetica, Arial, sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 25px;
        "
      >
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <!-- LOGO -->
          <tr>
            <td bgcolor="#16AAFF" align="center">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
              >
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#16AAFF" align="left" style="padding: 0px 10px 0px 10px">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="max-width: 600px"
              >
                <tr>
                  <td
                    bgcolor="#16AAFF"
                    align="left"
                    valign="top"
                    style="
                      padding: 40px 20px 20px 10px;
                      border-radius: 4px 4px 0px 0px;
                      color: #111111;
                      font-family: 'Lato', Helvetica, Arial, sans-serif;
                      font-size: 48px;
                      font-weight: 400;
                      letter-spacing: 4px;
                      line-height: 48px;
                    "
                  >
                    <img
                      src="https://prod.alectify.com/static/media/new_logo.29ecf03d.png"
                      width="200"
                      height="82"
                      style="display: block; border: 0px"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding: 0px 10px 0px 10px">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="max-width: 600px"
              >
                <tr>
                  <th
                    class="rnb-force-col"
                    style="
                      text-align: left;
                      font-weight: normal;
                      padding-right: 0px;
                    "
                    valign="top"
                  >
                    <table
                      border="0"
                      valign="top"
                      cellspacing="0"
                      cellpadding="0"
                      width="100%"
                      align="left"
                      class="rnb-col-1"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              font-size: 14px;
                              font-family: Arial, Helvetica, sans-serif, sans-serif;
                              color: #3c4858;
                            "
                          >
                            <br />
                            <div>${content}</div>
                            <br />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </th>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <footer
          align="left"
          style="
            border-radius: 0px 0px 4px 4px;
            color: #686666;
            font-size: 14px;
            padding: 0px 10px 0px 10px;
          "
         >
          <p style="font-size: 12px">
            This is an automated email that cannot accept incoming email. Please do
            not reply to this message.
          </p>
          <p style="font-size: 12px">
            For any customer support, please login to the platform and use the
            contact us form.
          </p>
        </footer>
      </body>
    </html>
    `;
  }

  static getPMTable(data) {
    let email = `<li><p style='margin: 0;'><b>${data.subProject.name}<b></p>
    <ul><li><p style='margin: 0;'> <b>Work Title</b>: <a href='${data.url}'>"${
      data.workTitle
    }"</a>, 
    <b>${
      data.isGeneric ? 'Generic' : data.area ? 'Asset Package:' : 'Asset:'
    }</b>`;
    if (data.area || data.asset) {
      email += ` ${data.area ? data.area.name : data.asset.name}`;
    }
    email += `</p></li><li><p style='margin: 0;'>
    <b>Created By:</b> ${data.createdBy.first_name} ${
      data.createdBy.last_name
    }, <b>Assigned To:</b> ${DefaultEmailTemplate.makeUsersDataWithoutEmail(
      data.assignees,
    )}</p></li> </ul></li>`;

    return email;
  }

  static makeUsersData(users) {
    let usersData = '';
    users.forEach((user, index) => {
      const commaSeperator = users.length - 1 != index ? ', ' : '';
      if (
        user?.user?.first_name &&
        user?.user?.last_name &&
        user?.user?.email
      ) {
        usersData += `${user.user.first_name} ${user.user.last_name} (${user.user.email})${commaSeperator}`;
      }
    });
    return usersData;
  }

  static makeUsersDataWithoutEmail(users) {
    let usersData = '';
    users.forEach((user, index) => {
      const commaSeperator = users.length - 1 != index ? ', ' : '';
      if (user?.user?.first_name && user?.user?.last_name) {
        usersData += `${user.user.first_name} ${user.user.last_name}${commaSeperator}`;
      }
    });
    return usersData;
  }
}
