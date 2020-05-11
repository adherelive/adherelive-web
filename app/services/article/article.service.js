const articleModel = require("../../models/article");

class ArticleService {
  constructor() {}

  async createArticle(articleData) {
    try {
      let article = await articleModel.create(articleData);
      return article;
    } catch (error) {
      throw error;
    }
  }

  async getArticles(userId) {
    try {
      const query = { [`participants.${userId}`]: { $exists: true } };
      let articles = await articleModel.find(query).lean();
      return articles;
    } catch (error) {
      throw error;
    }
  }

  async getRecentArticles(userId) {
    try {
      const query = { [`participants.${userId}`]: { $exists: true } };
      let articles = await articleModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();
      return articles;
    } catch (error) {
      throw error;
    }
  }

  async makeFavouriteUnfavourite(userId, articleId, isFavourite) {
    try {
      let updateQuery = { [`participants.${userId}.isFavourite`]: isFavourite };
      let article = await articleModel.findByIdAndUpdate(
        articleId,
        updateQuery
      );
      return article;
    } catch (error) {
      throw error;
    }
  }

  async getArticleById(articleId, userId) {
    try {
      const query = { [`participants.${userId}`]: { $exists: true } };
      let article = await articleModel
        .findOne({
          $and: [{ _id: articleId }, query]
        })
        .lean();
      return article;
    } catch (error) {
      throw error;
    }
  }

  async shareArticle(articleId, participantObject) {
    try {
      let article = await articleModel
        .findOneAndUpdate(
          { _id: articleId },
          {
            $set: participantObject
          },
          { new: true }
        )
        .lean();
      return article;
    } catch (error) {
      throw error;
    }
  }

  async getArticleByArticleId(articleId) {
    try {
      let article = await articleModel.find({ _id: articleId }).lean();
      return article;
    } catch (error) {
      throw error;
    }
  }

  async hasViewed(articleId, participantId) {
    try {
      let updatedArticle;
      let article = await articleModel.find({
        _id: articleId,
        views: participantId
      });

      if (article.length === 0) {
        updatedArticle = await articleModel
          .findOneAndUpdate(
            { _id: articleId },
            {
              $push: { views: participantId }
            },
            { new: true }
          )
          .lean();
      }
      return updatedArticle;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ArticleService();
