export function getSafeEncodedURI(imgUrl) {
	let filename = imgUrl.slice(imgUrl.lastIndexOf('/')).slice(1) // .slice(1) removes the starting / from the filename as well
	filename = encodeURIComponent(filename)
	let newUrlSafeImageURI = imgUrl.slice(0, imgUrl.lastIndexOf('/')) + '/' + filename
	return newUrlSafeImageURI
}
