export const getArticleEmailTemplateData = data => {
  const { participantName, title, articleId } = data;
  let mailData = {};
  mailData.host = process.config.APP_URL;
  mailData.userName = participantName;
  mailData.articleTitle = title;
  mailData.buttonText = "Read Article";
  mailData.link = `${process.config.WEB_URL}/articles/${articleId}`;
  return mailData;
};
