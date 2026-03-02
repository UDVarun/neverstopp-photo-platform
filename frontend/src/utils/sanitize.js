export function sanitize(text){

return text
.replace(/[^a-zA-Z0-9 ]/g,"")
.trim()

}