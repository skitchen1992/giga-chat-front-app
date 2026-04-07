import { createSelector } from "@reduxjs/toolkit"
import { selectModelList, selectSelectedModel } from "../../model/selectors"

export default createSelector(
	[selectSelectedModel, selectModelList],
	(selectedModel, modelList) => ({ selectedModel, modelList })
)
