import { useState } from "react";
import axiosInstance from "../utils/axios";

const useFetch = ({ method, url }, successFn, errorFn) => {
  const [requestState, setRequestState] = useState();

  const requestFunction = async (values, query = '') => {
    const methodUpper = method.toUpperCase()

    try {
      setRequestState("loading")
      const { data, status } = await axiosInstance({
        method: methodUpper,
        url: url + query,
        data: values
      })

      // if (status != 200 || status != 201) throw new Error(data.message)
      setRequestState("success")
      successFn && successFn(data)

      return data;
    } catch (error) {
      setRequestState("error")
      errorFn && errorFn(error)
    }

  }
  return {
    reqFunc: requestFunction,
    reqState: requestState
  }
}

export default useFetch;