import { Box, Container, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { SWRConfig } from 'swr';
import { Nav } from '../components/Nav';
import theme from './theme';

// axios.defaults.baseURL = 'http://localhost:3000';

export default class MyApp extends App {
	componentDidMount() {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}

	render() {
		const { Component, pageProps } = this.props;

		return (
			<React.Fragment>
				<Head>
					<title>My page</title>
					<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				</Head>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					<Nav />
					<SWRConfig value={{ fetcher: (url: string) => axios(url).then((r) => r.data) }}>
						<Container>
							<Box marginTop={2}>
								<Component {...pageProps} />
							</Box>
						</Container>
					</SWRConfig>
				</ThemeProvider>
			</React.Fragment>
		);
	}
}
