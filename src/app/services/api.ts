import {
	oauthExpiresAtToMs,
	persistAuthSession
} from '@/features/auth/lib/persistedAuthSession'
import {setAuthSession} from '@/features/auth/model/slice'
import {setModelList} from '@/features/settings/model/slice'
import {api} from '@/shared/api'

api.enhanceEndpoints({
	endpoints: {
		getAuthToken: {
			async onQueryStarted(_arg, {queryFulfilled, dispatch}) {
				try {
					const {data} = await queryFulfilled

					const tokenExpiresAtMs = oauthExpiresAtToMs(data.expires_at)

					const session = {
						accessToken: data.access_token,
						tokenExpiresAtMs
					}
					dispatch(setAuthSession(session))
					persistAuthSession(session)
				} catch {}
			}
		},
		getModels: {
			async onQueryStarted(_arg, {queryFulfilled, dispatch}) {
				try {
					const {data} = await queryFulfilled
					dispatch(setModelList(data.data))
				} catch {}
			}
		}
	}
})

export {api}
