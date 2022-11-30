import axios, { AxiosInstance } from 'axios'

export default class Gateway {
  private request: AxiosInstance

  constructor(endpoint: string) {
    endpoint = endpoint.replace(/\/$/, '')
    this.request = axios.create({
      baseURL: endpoint + '/data/v1',
      validateStatus: status => status < 500
    })
  }

  async send<T = any>(
    url: string,
    payload: any,
    headers: Record<string, any> = {}
  ) {
    try {
      const { data, status } = await this.request.post(url, payload, {
        headers: {
          ...headers,
          'X-GlacierDB-Version': '0.0.1'
        }
      })
      if (status !== 200) {
        throw new Error(data.message || 'Internal Server Error')
      }
      return data as T
    } catch (error) {
      const message = error?.response?.data?.message || error?.message
      throw new Error(message || 'Internal Server Error')
    }
  }
}
