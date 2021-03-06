// import utils
import firebase from "utils/firebase";
// import models
import * as Model from "models/articleModel";


// 記事作成
export const createAtricle = async (data: Model.Article) => {
  try {
    await firebase
      .firestore()
      .collection("articles")
      .doc()
      .set(data)
      .catch(err => {
        throw new Error(err.message);
      });
    const success = { success: "200 ok, success" };
    return { success };
  } catch(error) {
    return { error };
  }
};

// 記事更新
export const updateAtricle = async (data: Model.Article) => {
  try {
    await firebase
      .firestore()
      .collection("articles")
      .doc(data.uid)
      .update(data)
      .catch(err => {
        throw new Error(err.message);
      });
    const success = { success: "200 ok, success" };
    return { success };
  } catch(error) {
    return { error };
  }
};

// 記事いいね更新
export const changeArticleGoodCount = async (articleId: string, isDone: boolean) => {
  try {
    let currentGoodCount = 0;
    // 現在のいいね数取得
    await firebase
      .firestore()
      .collection("articles")
      .doc(articleId)
      .get()
      .then(doc => {
        if(!doc.exists) {
          throw new Error();
        }
        const data = Object.assign({}, doc.data());
        currentGoodCount = data.goodCount;
      })
      .catch(err => {
        throw new Error(err.message);
      });

    await firebase
      .firestore()
      .collection("articles")
      .doc(articleId)
      .update({
        goodCount: isDone ? currentGoodCount - 1 : currentGoodCount + 1
      })
      .catch(err => {
        throw new Error(err.message);
      });
    const success = { success: "200 ok, success" };
    return { success };
  } catch(error) {
    return { error };
  }
};

// 記事削除
export const deleteAtricle = async (articleId: string) => {
  try {
    await firebase
      .firestore()
      .collection("articles")
      .doc(articleId)
      .delete()
      .catch(err => {
        throw new Error(err.message);
      });
    const success = { success: "200 ok, success" };
    return { success };
  } catch(error) {
    return { error };
  }
};

// スライドショー用記事取得
export const getSlideShowArticles = async () => {
  try {
    const articles: Model.Article[] = [];
    await firebase
      .firestore()
      .collection("articles")
      .where("isAddSlideShow", "==", true)
      .get()
      .then(snapshot => {
        if(snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          articles.push({
            uid: doc.id,
            content: doc.data().content,
            title: doc.data().title,
            subTitle: doc.data().subTitle,
            date: doc.data().date.toDate(),
            tagIds: doc.data().tagIds,
            goodCount: doc.data().goodCount,
            thumbnailImagePath: doc.data().thumbnailImagePath
          });
        });
      })
      .catch(err => {
        throw new Error(err.message);
      });
    return { articles };
  } catch(error) {
    return { error };
  }
};

// 最新の記事を5件取得(dateを渡して,ページングに対応させている)
export const getLatestArticles = async (date: Date) => {
  try {
    const articles: Model.Article[] = [];
    await firebase
      .firestore()
      .collection("articles")
      .orderBy("date", "desc")
      .startAfter(date)
      .limit(5)
      .get()
      .then(snapshot => {
        if(snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          articles.push({
            uid: doc.id,
            content: doc.data().content,
            subTitle: doc.data().subTitle,
            title: doc.data().title,
            date: doc.data().date.toDate(),
            tagIds: doc.data().tagIds,
            goodCount: doc.data().goodCount,
            thumbnailImagePath: doc.data().thumbnailImagePath
          });
        });
      })
      .catch(err => {
        throw new Error(err.message);
      });
    return { articles };
  } catch(error) {
    return { error };
  }
};

// いいねの多い記事順にソート
export const getArticlesByGoodCount = async () => {
  try {
    const articles: Model.Article[] = [];
    await firebase
      .firestore()
      .collection("articles")
      .orderBy("goodCount", "desc")
      .get()
      .then(snapshot => {
        if(snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          articles.push({
            uid: doc.id,
            content: doc.data().content,
            subTitle: doc.data().subTitle,
            title: doc.data().title,
            date: doc.data().date.toDate(),
            tagIds: doc.data().tagIds,
            goodCount: doc.data().goodCount,
            thumbnailImagePath: doc.data().thumbnailImagePath
          });
        });
      })
      .catch(err => {
        throw new Error(err.message);
      });
    return { articles };
  } catch(error) {
    return { error };
  }
};

// 記事を全て取得
export const getArticles = async () => {
  try {
    const articles: Model.Article[] = [];
    await firebase
      .firestore()
      .collection("articles")
      .orderBy("date", "desc")
      .get()
      .then(snapshot => {
        if(snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          articles.push({
            uid: doc.id,
            content: doc.data().content,
            subTitle: doc.data().subTitle,
            title: doc.data().title,
            date: doc.data().date.toDate(),
            tagIds: doc.data().tagIds,
            goodCount: doc.data().goodCount,
            thumbnailImagePath: doc.data().thumbnailImagePath
          });
        });
      })
      .catch(err => {
        throw new Error(err.message);
      });
    return { articles };
  } catch(error) {
    return { error };
  }
};

// idに一致した記事を取得
export const getArticle = async (id: string) => {
  try {
    let article = null;
    await firebase
      .firestore()
      .collection("articles")
      .doc(id)
      .get()
      .then(doc => {
        if(!doc.exists) {
          return;
        }
        const data = Object.assign({}, doc.data());
        data.uid = doc.id;
        // firestoreからDate型を取得する際、暗黙的にTimeStamp型になってしまうため
        data.date = data.date.toDate();
        article = data;
      })
      .catch(err => {
        throw new Error(err.message);
      });
    return { article };
  } catch(error) {
    return { error };
  }
};

// idに一致した記事の前の記事を取得
export const getPrevArticle = async (date: Date) => {
  try {
    let article = null;
    const prevArticles: Model.Article[] = [];
    await firebase
      .firestore()
      .collection("articles")
      .orderBy("date", "desc")
      .where("date", "<", date)
      .get()
      .then(snapshot => {
        if(snapshot.empty) {
          throw new Error();
        }
        snapshot.forEach(doc => {
          prevArticles.push({
            uid: doc.id,
            content: doc.data().content,
            subTitle: doc.data().subTitle,
            title: doc.data().title,
            date: doc.data().date.toDate(),
            tagIds: doc.data().tagIds,
            goodCount: doc.data().goodCount,
            thumbnailImagePath: doc.data().thumbnailImagePath
          });
        });
      })
      .catch(err => {
        throw new Error(err.message);
      });

    article = prevArticles[0];
    return { article };
  } catch(error) {
    return { error };
  }
};

// idに一致した記事の次の記事を取得
export const getNextArticle = async (date: Date) => {
  try {
    let article = null;
    const nextArticles: Model.Article[] = [];
    await firebase
      .firestore()
      .collection("articles")
      .orderBy("date", "desc")
      .where("date", ">", date)
      .get()
      .then(snapshot => {
        if(snapshot.empty) {
          throw new Error();
        }
        snapshot.forEach(doc => {
          nextArticles.push({
            uid: doc.id,
            content: doc.data().content,
            subTitle: doc.data().subTitle,
            title: doc.data().title,
            date: doc.data().date.toDate(),
            tagIds: doc.data().tagIds,
            goodCount: doc.data().goodCount,
            thumbnailImagePath: doc.data().thumbnailImagePath
          });
        });
      })
      .catch(err => {
        throw new Error(err.message);
      });

    article = nextArticles[nextArticles.length - 1];
    return { article };
  } catch(error) {
    return { error };
  }
};

// タグ名に紐ずく記事の取得
export const getArticlesByTag = async (tagId: string) => {
  try {
    const articlesByTag: Model.Article[] = [];
    await firebase
      .firestore()
      .collection("articles")
      .orderBy("date", "desc")
      .where("tagIds", "array-contains", tagId)
      .get()
      .then(snapshot => {
        if(snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          articlesByTag.push({
            uid: doc.id,
            content: doc.data().content,
            subTitle: doc.data().subTitle,
            title: doc.data().title,
            date: doc.data().date.toDate(),
            tagIds: doc.data().tagIds,
            goodCount: doc.data().goodCount,
            thumbnailImagePath: doc.data().thumbnailImagePath
          });
        });
      })
      .catch(err => {
        throw new Error(err.message);
      });
    return { articlesByTag };
  } catch(error) {
    return { error };
  }
};
