import {
	createApp,
	reactive
} from './piterVue.js';
const data = reactive({
	loading: false,
	textarea: "",
	input: "",
	fileList: [],
	email: "18733842561@139.com"
});
const blobToDataURL = (file, cb) => {
	let reader = new FileReader();
	reader.onload = function(evt) {
		let base64 = evt.target.result;
		if (cb)
			cb(base64);
	};
	let blob = new Blob([file]);
	console.log(blob)
	reader.readAsDataURL(blob);
};
const options = {
	data,
	send() {
		data.loading = true;
		Email.send({
			Host: "smtp.qq.com",
			Username: "1291481728@qq.com",
			Password: "pypxeeydkquzhbde",
			To: '',
			From: "1291481728@qq.com",
			Subject: data.input,
			Body: data.textarea,
			Attachments: data.fileList
		}).then(message => {
			alert("message");
			data.loading = false;
			data.textarea = "";
			data.input = "";
			data.fileList = [];
			data.email = "18733842561@139.com";
		});
	},
	fileEvent(e) {
		let files = document.getElementById("files");
		console
		for (let i = 0; i < e.target.files.length; i++) {
			let url = e.target.files[i];
			console.log(url)
			blobToDataURL(url, res => {
				let obj = {
					name: url.name,
					data: res
				};
				data.fileList.push(obj);
				if ((i + 1) == e.target.files.length) {
					files.value = '';
				}
			});
		}
	},
	dele(index) {
		let left = data.fileList.slice(0, index);
		let right = data.fileList.slice(index + 1, data.fileList.length)
		data.fileList = [...left, ...right];
	},
	aHref(){
		location.href = "https://www.cnblogs.com/ooo51o" ;
	}
};
let app = createApp(options);
app.mount("#app");
