async function CreateNewFileWithDataAsync(fileName, data, errCallback) {
	var fs = require("fs");
	fs.writeFile(fileName, data, errCallback);
}

module.exports = {
	CreateNewFileWithDataAsync,
};
