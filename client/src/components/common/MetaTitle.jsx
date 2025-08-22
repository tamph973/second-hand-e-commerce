import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTitle = (props) => {
	return (
		<Helmet>
			<meta charSet='utf-8' />
			<title>{props.title}</title>
		</Helmet>
	);
};

export default MetaTitle;
