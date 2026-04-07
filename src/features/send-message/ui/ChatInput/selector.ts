import { createSelector } from "@reduxjs/toolkit";
import { selectRequestParams } from "@/features/settings";
import {
  selectAttachmentsSelector,
  selectMessageSelector,
} from "../../model/selectors";

export default createSelector(
  [selectMessageSelector, selectAttachmentsSelector, selectRequestParams],
  (message, attachments, requestParams) => ({
    message,
    attachments,
    requestParams,
  })
);
