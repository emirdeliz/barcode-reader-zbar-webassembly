export const checkIsNodeEnvironment = () => {
	return typeof window === 'undefined';
};

export const checkIsTestEnvironment = () => {
  return process.env.NODE_ENV === 'test';
};

export const checkIsProductionEnvironment = () => {
	return process.env.NODE_ENV === 'production';
}