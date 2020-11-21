import { GetStaticProps } from 'next';
import { openDB } from '../openDB';
import { FaqModel } from '../../api/Faq';
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
interface FaqProps {
	faq: FaqModel[];
}

export default function Faq({ faq }: FaqProps) {
	const router = useRouter();
	console.log(router);

	return (
		<Fragment>
			<Head>
				<title> Car Trader || Faq</title>
			</Head>
			{faq.map((f) => (
				<Accordion key={f.id}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<Typography variant="h4"> {f.question}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography variant="subtitle1">{f.answer}</Typography>
					</AccordionDetails>
				</Accordion>
			))}
		</Fragment>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const db = await openDB();
	const faq = await db.all('SELECT * FROM FAQ ORDER BY createDate DESC');
	return {
		props: {
			faq: faq
		}
	};
};
