import { createSelector } from '@reduxjs/toolkit';
import { selectAttachmentsSelector, selectMessageSelector } from '../../model/selectors';


export default createSelector([selectMessageSelector, selectAttachmentsSelector], (message, attachments) => ({
  message,
  attachments,
}));