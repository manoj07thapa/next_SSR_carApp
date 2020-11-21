import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getMakes, Make } from '../database/getMakes';
import { Form, Formik, Field, useField, useFormikContext } from 'formik';
import { Paper, Grid, FormControl, InputLabel, Select, MenuItem, SelectProps, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import router, { useRouter } from 'next/router';
import { Model, getModels } from '../database/getModels';
import { getAsString } from '../getAsString';
import useSWR from 'swr';

export interface SearchProps {
	makes: Make[];
	models: Model[];
	singleCloumn?: boolean;
}

const useStyles = makeStyles((theme) => ({
	paper: {
		margin: 'auto',
		maxWidth: 500,
		padding: theme.spacing(3)
	}
}));

const prices = [ 500, 1000, 5000, 15000, 25000, 50000, 250000 ];

export default function Search({ makes, models, singleCloumn }: SearchProps) {
	const classes = useStyles();
	const { query } = useRouter();
	const smValue = singleCloumn ? 12 : 6;

	const initialValues = {
		make: getAsString(query.make) || 'all',
		model: getAsString(query.model) || 'all',
		minPrice: getAsString(query.minPrice) || 'all',
		maxPrice: getAsString(query.maxPrice) || 'all'
	};

	return (
		<div>
			<Head>
				<title>Car Trader</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Formik
				initialValues={initialValues}
				onSubmit={(values) => {
					router.push(
						{
							pathname: '/cars',
							query: { ...values, page: 1 }
						},
						undefined,
						{ shallow: true }
					);
				}}
			>
				{({ values }) => (
					<Form>
						<Paper elevation={3} className={classes.paper}>
							<Grid container spacing={4}>
								<Grid item xs={12} sm={smValue}>
									<FormControl fullWidth variant="outlined">
										<InputLabel id="search-make">Make</InputLabel>
										<Field name="make" as={Select} id="search-make" label="Make">
											<MenuItem value="all">
												<em>All Makes</em>
											</MenuItem>
											{makes.map((make, i) => (
												<MenuItem
													value={make.make}
													key={i}
												>{`${make.make} (${make.count})`}</MenuItem>
											))}
										</Field>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={smValue}>
									<ModelSelect name="model" models={models} make={values.make} />
								</Grid>
								<Grid item xs={12} sm={smValue}>
									<FormControl fullWidth variant="outlined">
										<InputLabel id="search-min-price">Min Price</InputLabel>
										<Field name="minPrice" as={Select} id="search-min-price" label="Min Price">
											<MenuItem value="all">
												<em>No Min</em>
											</MenuItem>
											{prices.map((price, i) => (
												<MenuItem value={price} key={i}>
													{price}
												</MenuItem>
											))}
										</Field>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={smValue}>
									<FormControl fullWidth variant="outlined">
										<InputLabel id="search-max-price">Max Price</InputLabel>
										<Field name="maxPrice" as={Select} id="search-max-price" label="Max Price">
											<MenuItem value="all">
												<em>No Max</em>
											</MenuItem>
											{prices.map((price, i) => (
												<MenuItem value={price} key={i}>
													{price}
												</MenuItem>
											))}
										</Field>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Button type="submit" variant="contained" color="primary" fullWidth>
										Search
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export interface ModelSelectProps extends SelectProps {
	name: string;
	models: Model[];
	make: string;
}

export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
	const { setFieldValue } = useFormikContext();
	const [ field ] = useField({
		name: props.name
	});
	const { data } = useSWR<Model[]>('/api/models?make=' + make, {
		dedupingInterval: 60000,
		onSuccess: (newValues) => {
			if (!newValues.map((a) => a.model).includes(field.value)) {
				setFieldValue('model', 'all');
			}
		}
	});
	const newModels = data || models;
	return (
		<FormControl fullWidth variant="outlined">
			<InputLabel id="search-model">Model</InputLabel>
			<Select name="model" {...field} {...props} id="search-model" label="Model">
				<MenuItem value="all">
					<em>All Models</em>
				</MenuItem>
				{newModels.map((model, j) => (
					<MenuItem value={model.model} key={j}>{`${model.model} (${model.count})`}</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const make = getAsString(ctx.query.make);
	const [ makes, models ] = await Promise.all([ getMakes(), getModels(make) ]);
	return { props: { makes, models } };
};
