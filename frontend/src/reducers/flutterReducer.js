import { VERIFICATION_REQ_STATE,VERIFIED_STATE } from '../constants/orderConstants'
const initialState = {
    VerificationRequired: false,
    isVerified: false,
    link: null
}

const flutterReducer = (state=initialState,action) => {
    switch(action.type){
        case VERIFICATION_REQ_STATE:
            return {
                ...state,
                VerificationRequired: !state.VerificationRequired,
                link: action.payload.link
            }
        case VERIFIED_STATE:
            return {
                ...state,
                isVerified: !state.isVerified,
                link: action.payload.link
            }
        default:
            return {
                ...state
            }
    }
}

export default flutterReducer;