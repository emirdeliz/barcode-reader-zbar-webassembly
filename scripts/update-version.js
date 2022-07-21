const util = require('util');
const exec = util.promisify(require('child_process').exec);

const TypeVersion = {
	MAJOR: 'major',
	MINOR: 'minor',
	PATCH: 'patch',
};

const getTypeVersion = () => {
	const isMajorVersion = process.argv.includes('--major');
	const isMinorVersion = process.argv.includes('--minor');

	switch (true) {
		case isMajorVersion:
			return TypeVersion.MAJOR;
		case isMinorVersion:
			return TypeVersion.MINOR;
		default:
			return TypeVersion.PATCH;
	}
};

const commitPullRequestToNewVersion = async (newVersion) => {
	console.log(`Committing new version ${newVersion}...`);
	await exec(`
		git checkout -b NV-${newVersion} &&
		git add . && 
		git commit -m "New release: ${newVersion}" && 
		git push --set-upstream origin NV-${newVersion} &&
		git push origin --tags && 
		git checkout -
	`);
};

const updateVersion = async () => {
	const typeVersion = getTypeVersion();
	try {
		console.log('Updating version...');
		console.log(`${typeVersion} version detected`);
		const { stdout } = await exec(`yarn version --${typeVersion}`);
		const newVersion = stdout.match(/(\d+\.)(\d+\.)(\d)/g)[1];
		await commitPullRequestToNewVersion(newVersion);
	} catch (e) {
		console.error(e);
	}
};
updateVersion();
