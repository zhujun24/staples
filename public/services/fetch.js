import 'isomorphic-fetch'

const parseJSON = response => {
  return response.json()
}

const get = (url, data = {}) => {
  // eslint-disable-next-line
  return fetch(url, data).then(parseJSON)
}

const generateHttp = (method) => {
  return (url, data = {}) => {
    const formData = data.formData || {}
    const headerData = data.headerData || {}

    // eslint-disable-next-line
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headerData
      },
      body: typeof formData === 'string' ? formData : JSON.stringify(formData)
    }).then(parseJSON)
  }
}

const fetchService = {
  get,
  post: generateHttp('POST'),
  option: generateHttp('OPTION'),
  put: generateHttp('PUT'),
  delete: generateHttp('DELETE')
}

export default fetchService
