import {
	createApp,
	reactive,
} from './piterVue.js'

let data = reactive({
	loading: false,
	content: '',
	title: '',
	fileList: [],
	email: ''
})

let blobToDataURL = (file, cb) => {
	let reader = new FileReader()
	reader.onload = function(evt) {
		let base64 = evt.target.result
		if (cb)
			cb(base64)
	}
	let blob = new Blob([file])
	console.log(blob)
	reader.readAsDataURL(blob)
}

// VH to solve the influence of H5 soft keyboard
let keyboardHeight = () => {
	var initViewport = function(height) {
		var metaEl = document.querySelector('#viewportMeta')
		var content = 'width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,height=' + height
		metaEl.setAttribute('name', 'viewport')
		metaEl.setAttribute('content', content)
	}

	initViewport(window.innerHeight)

	var addEvenListener = function(callback, eventName) {
		let addEvenListenerFn = window.addEventListener || window.attatchEvent
		let messageEvent = window.addEventListener ? eventName : 'on' + eventName
		addEvenListenerFn(messageEvent, callback, false)
	}

	addEvenListener(function() {
		setTimeout(function() {
			initViewport(window.innerHeight)
		}, 300)
	}, 'orientationchange')

	addEvenListener(function() {
		window.windowSizeSave = {
			height: window.innerHeight,
			width: window.innerWidth
		}
	}, 'load')

	addEvenListener(function() {
		setTimeout(function() {
			if (
				(Math.abs(window.innerHeight - window.windowSizeSave.height) < 100 &&
					Math.abs(window.innerWidth - window.windowSizeSave.width) < 100) ||
				(Math.abs(window.innerHeight - window.windowSizeSave.width) < 100 &&
					Math.abs(window.innerWidth - window.windowSizeSave.height) < 100)
			) {
				initViewport(window.innerHeight)
			}
		}, 300)
	}, 'resize')
}

let options = {
	data,
	send() {
		// Form check
		let myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
		if (!myReg.test(data.email)) {
			alert('The email format is incorrect !')
			return false
		} else if (!data.title) {
			alert('Please input the title !')
			return false
		} else if (!data.content) {
			alert('Please input the content !')
			return false
		}

		data.loading = true
		Email.send({
			Host: 'smtp.qq.com',
			Username: '1291481728@qq.com',
			Password: 'pypxeeydkquzhbde',
			To: data.email,
			From: '1291481728@qq.com',
			Subject: data.title,
			Body: data.content,
			Attachments: data.fileList
		}).then(message => {
			alert('Sent successfully !')
			data.loading = false
			data.content = ''
			data.title = ''
			data.fileList = []
			data.email = ''
		})
	},
	fileEvent(e) {
		let files = document.getElementById('files')
		for (let i = 0; i < e.target.files.length; i++) {
			let url = e.target.files[i]
			blobToDataURL(url, res => {
				let obj = {
					name: url.name,
					data: res
				}
				data.fileList.push(obj)
				if ((i + 1) == e.target.files.length) {
					files.value = ''
				}
			})
		}
	},
	dele(index) {
		let left = data.fileList.slice(0, index)
		let right = data.fileList.slice(index + 1, data.fileList.length)
		data.fileList = [...left, ...right]
	},
	aHref() {
		location.href = 'https://www.cnblogs.com/ooo51o'
	},
	mounted() {
		keyboardHeight()
	}
}

// Render
createApp(options).mount('#app')
