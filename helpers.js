const axios = require('axios')

const request = async (url) => {
	return axios.get(url).then(res => res.data).catch(err => {
		console.error(err)
	})
}

module.exports = {
    request
}