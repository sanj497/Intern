import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUS } from "../status/Status";

const khaltiSlice = createSlice({
  name: "khal",
  initialState: {
    khaltiUrl: null,
    pidx: null,
    status: STATUS.IDLE,
  },
  reducers: {
    setKhaltiUrl(state, action) {
      state.khaltiUrl = action.payload;
    },
    setPidx(state, action) {
      state.pidx = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setKhaltiUrl, setPidx, setStatus } = khaltiSlice.actions;
export default khaltiSlice.reducer;

export function khaltiPayment(data) {
  return async function (dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await axios.post("http://localhost:5000/api/khalti/initiate", data);

      if (response.status === 200) {
        const url = response.data?.url;
        const pidx = response.data?.data?.pidx;

        if (url) {
          dispatch(setKhaltiUrl(url));
        } else {
          dispatch(setKhaltiUrl(null));
        }

        if (pidx) {
          dispatch(setPidx(pidx));
        } else {
          dispatch(setPidx(null));
        }

        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      console.error("Khalti Payment Error:", err);
      dispatch(setStatus(STATUS.ERROR));
    }
  };
}

export function verifyKhaltiPayment(pidx) {
  return async function (dispatch) {
    dispatch(setStatus(STATUS.LOADING));

    try {
      const response = await axios.post("http://localhost:5000/api/khalti/verify", { pidx });

      if (response.status === 200 && response.data?.status === "Completed") {
        console.log("Payment verified:", response.data);
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        console.warn("Payment verification failed:", response.data);
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      console.error("Khalti Verify Error:", err);
      dispatch(setStatus(STATUS.ERROR));
    }
  };
}