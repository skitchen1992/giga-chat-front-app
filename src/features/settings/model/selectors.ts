import {createSelector} from '@reduxjs/toolkit'
import type {RootState} from '@/app/store'

export const selectSettings = (state: RootState) => state.settings

export const selectRequestParams = createSelector(
	selectSettings,
	settings => settings.requestParams
)
