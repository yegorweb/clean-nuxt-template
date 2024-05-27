import * as jws from 'jws'

export default function(jwt: string) {
	let decoded = jws.decode(jwt)
  if (!decoded) 
		return null

  let payload = decoded.payload

  if (typeof payload === 'string') {
    try {
      let obj = JSON.parse(payload)
      if (obj !== null && typeof obj === 'object')
        payload = obj
    } catch {}
  }

  return payload
}