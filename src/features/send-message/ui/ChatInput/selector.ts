import { createSelector } from "@reduxjs/toolkit";
import { selectRequestParams, selectSelectedModel } from "@/features/settings";
import {
  selectAttachmentsSelector,
  selectMessageSelector,
} from "../../model/selectors";

export default createSelector(
  [
    selectMessageSelector,
    selectAttachmentsSelector,
    selectRequestParams,
    selectSelectedModel,
  ],
  (message, attachments, requestParams, selectedModel) => ({
    message,
    attachments,
    requestParams,
    selectedModel,
  })
);
