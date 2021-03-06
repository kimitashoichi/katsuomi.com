import React, { FC, useState, FormEvent, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import uniq from "lodash/uniq";
import { bindActionCreators, Dispatch } from "redux";
import { withRouter, RouteComponentProps } from 'react-router';

// import organisms
import AdminLogin from "components/organisms/admin/AdminLogin";
import AdminCreateArticleTags from "components/react-input-tag/AdminCreateArticleTags";

// import molecules
import InputLabel from "components/molecules/InputLabel";
import CheckBox from "components/molecules/CheckBox";

// import atoms
import Input from "components/atoms/Input";
import Button from "components/atoms/Button";

// import commons
import Spinner from "components/commons/Spinner";

// import actions
import { createArticle, updateArticle, deleteArticle } from "actions/articleAction";

// import models
import { AppState } from "models/index";
import * as adminLoginModel from "models/adminLoginModel";
import * as articleModel from "models/articleModel";
import * as tagModel from "models/tagModel";

// import methods
import { isAdmin } from "methods/adminLoginMethods";

// import utils
import * as breakPoints from "utils/breakPoints";
import * as colors from "utils/color";
import * as fontSize from "utils/fontSize";

// import imageUploader
import ImageUploader from "components/imageUploader/ImageUploader";

// import markdown-editor
import Editor from "components/markdown-editor/Editor";
import { dialogMessage } from "methods/utilsMethods";

interface StateProps {
  user?: adminLoginModel.User;
  isLoading?: boolean;
}

interface DispatchProps {
  createArticle: (payload: articleModel.Article) => void;
  updateArticle: (payload: articleModel.Article) => void;
  deleteArticle: (payload: string) => void;
}

interface Props extends RouteComponentProps<{}>, React.Props<{}> {
  isEdit?: boolean;
  isCreate?: boolean;
  article?: articleModel.Article;
}

type DefaultProps = StateProps & DispatchProps & Props;

const localStorage = window.localStorage;

const ContentWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  align-items: center;
`;

const Title = styled.h4`
  font-size: ${fontSize.H3};
  align-self: center;
  color: ${colors.CAPTION};
`;

const Left = styled.div`
  align-self: flex-start;
  margin-left: 14%;
`;

const AdminCreateEditArticleContainer: FC<DefaultProps> = ({
  user,
  isLoading,
  createArticle,
  updateArticle,
  deleteArticle,
  isEdit,
  isCreate,
  article,
  history
}) => {
  const [title, setTitle] = useState<string>(article ? article.title : "");
  const [subTitle, setSubTitle] = useState<string>(article ? article.subTitle : "");
  const [thumbnailImagePath, setThumbnailImagePath] = useState<string>(article ? article.thumbnailImagePath : "");
  const [content, setContent] = useState<string>(article ? article.content : '');
  const [tagIds, setTagIds] = useState<string[]>(article ? article.tagIds : []);
  const [date, setDate] = useState<Date>(article ? article.date : new Date());
  const [isAddSlideShow, setIsAddSlideShow] = useState<boolean>(article && article.isAddSlideShow ? article.isAddSlideShow : false);

  if(isCreate && localStorage.draftContent && content !== localStorage.draftContent) {
    setContent(localStorage.draftContent);
  }

  const defaultTags: tagModel.Tag[] = [];
  if(article) {
    article.tagIds.forEach((tagId) => {
      defaultTags.push({
        id: tagId,
        text: tagId
      });
    });
  }

  const isDisabled =
    title && subTitle && content && thumbnailImagePath && date ? false : true;

  if(user === undefined || (user && !isAdmin(user))) {
    return <AdminLogin />;
  }

  const handleOnDelete = async (e: FormEvent) => {
    e.preventDefault();
    const articleId = article && article.uid ? article.uid : "";
    const isOK = dialogMessage('この記事を削除します。大丈夫ですか？');
    if(isOK) {
      await deleteArticle(articleId);
      await history.push('/admin');
    }
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      uid: article ? article.uid : "",
      title: title,
      subTitle: subTitle,
      thumbnailImagePath: thumbnailImagePath,
      content: content,
      date: date instanceof Date ? date : new Date(),
      tagIds: tagIds,
      goodCount: article ? article.goodCount : 0,
      isAddSlideShow: isAddSlideShow
    };

    isCreate && await createArticle(payload);
    isEdit && await updateArticle(payload);

    if(isCreate) {
      setTitle("");
      setSubTitle("");
      setThumbnailImagePath("");
      setContent("");
      setTagIds([]);
      setDate(new Date());
      setIsAddSlideShow(false);
      localStorage.draftContent = '';
    }

    if(isEdit) {
      await history.push('/admin');
    }
  };

  const handleOnChangeContent = (value: string) => {
    if(isCreate) {
      localStorage.draftContent = value;
    }
    setContent(value);
  };

  const handleOnChangeIsAddSlideShow = () => {
    setIsAddSlideShow(!isAddSlideShow);
  };

  const handleOnBlurTagIds = (tags: tagModel.Tag[]) => {
    setTagIds([]);
    tags.forEach(tag => setTagIds(tagIds => uniq([...tagIds, tag.id])));
  };

  const submitMessage = isCreate ? '作成' : '更新';

  return (
    <>
      {isLoading ? (
        <Spinner
          top={breakPoints.isSmartPhone() ? "58%" : "35%"}
          left={"50%"}
        />
      ) : (
          <>
            <ContentWrapper>
              <Title>記事をかく</Title>
              <Left>
                <InputLabel isRequired={true}>タグを追加(最大5個まで)</InputLabel>
              </Left>
              <AdminCreateArticleTags defaultTags={defaultTags} onBlur={tags => handleOnBlurTagIds(tags)} />
              <Left>
                <InputLabel isRequired={true}>タイトル</InputLabel>
              </Left>
              <Input
                placeholder=""
                isRequired={true}
                value={title}
                width={breakPoints.isSmartPhone() ? "300px" : "70vw"}
                borderColor={colors.BORDER_LIGHT_GRAY}
                backgroundColor={colors.BACKGROUND_LIGHT_GRAY}
                margin={["10px", "10px", "0px", "0px"]}
                padding={["10px", "10px", "10px", "10px"]}
                onChange={setTitle}
              />
              <Left>
                <InputLabel isRequired={true}>サブタイトル</InputLabel>
              </Left>
              <Input
                placeholder=""
                isRequired={true}
                value={subTitle}
                width={breakPoints.isSmartPhone() ? "300px" : "70vw"}
                borderColor={colors.BORDER_LIGHT_GRAY}
                backgroundColor={colors.BACKGROUND_LIGHT_GRAY}
                margin={["10px", "10px", "0px", "0px"]}
                padding={["10px", "10px", "10px", "10px"]}
                onChange={setSubTitle}
              />
              <Left>
                <InputLabel isRequired={true}>日付</InputLabel>
              </Left>
              <Input
                placeholder=""
                isRequired={true}
                date={date instanceof Date ? date : new Date()}
                type="date"
                width={breakPoints.isSmartPhone() ? "300px" : "70vw"}
                borderColor={colors.BORDER_LIGHT_GRAY}
                backgroundColor={colors.BACKGROUND_LIGHT_GRAY}
                margin={["10px", "10px", "0px", "0px"]}
                padding={["10px", "10px", "10px", "10px"]}
                onChange={setDate}
              />
              <Left>
                <InputLabel isRequired={true}>サムネイル画像</InputLabel>
              </Left>
              <ImageUploader
                onChange={setThumbnailImagePath}
                value="サムネイル画像"
              />
              <Left>
                <CheckBox
                  keyWord="isSlider"
                  onChange={handleOnChangeIsAddSlideShow}
                  checkBoxValue={isAddSlideShow}
                >
                  スライドショーに載せる(横長写真推奨)
                </CheckBox>
              </Left>
              <Left>
                <InputLabel isRequired={true}>内容</InputLabel>
              </Left>
              <Editor onChange={handleOnChangeContent} defaultValue={content} />

              <Button
                isDisabled={isDisabled}
                borderColor={colors.BLUE}
                backgroundColor={colors.BRIGHT_BLUE}
                color={colors.WHITE}
                isFontWeight={true}
                onClick={handleOnSubmit}
                padding={["3px", "3px", "80px", "80px"]}
                margin={["20px", "0px", "0px", "0px"]}
                width="75%"
              >
                {submitMessage}
              </Button>
              {isEdit && <Button
                isDisabled={isDisabled}
                borderColor={colors.RED}
                backgroundColor={colors.RED}
                color={colors.WHITE}
                isFontWeight={true}
                onClick={handleOnDelete}
                padding={["3px", "3px", "80px", "80px"]}
                margin={["20px", "0px", "0px", "0px"]}
                width="75%"
              >
                削除
              </Button>}
            </ContentWrapper>
          </>
        )}
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.adminLogin.user,
  isLoading: state.article.isLoading
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createArticle: payload => createArticle.start(payload),
      updateArticle: payload => updateArticle.start(payload),
      deleteArticle: payload => deleteArticle.start(payload)
    },
    dispatch
  );

export default withRouter<any, any>(connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminCreateEditArticleContainer));
