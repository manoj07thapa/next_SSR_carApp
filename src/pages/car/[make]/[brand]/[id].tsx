import { GetServerSideProps } from 'next';
import { openDB } from '../../../../openDB';
import { CarModel } from '../../../../../api/Car';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Head from 'next/head';

interface CarDetailProps {
	car: CarModel | null | undefined;
}

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(2),
		margin: 'auto'
	},

	img: {
		width: '100%'
	}
}));

export default function CarDetail({ car }: CarDetailProps) {
	const classes = useStyles();

	if (!car) {
		return <h1>Sorry car not found</h1>;
	}
	return (
		<div>
			<Head>
				<title>{car.make}</title>
			</Head>
			<Paper className={classes.paper}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={5}>
						<img className={classes.img} alt="complex" src={car.photoUrl} />
					</Grid>
					<Grid item xs={12} sm={6} md={7} container>
						<Grid item xs container direction="column" spacing={2}>
							<Grid item xs>
								<Typography gutterBottom variant="h5">
									{car.make + '' + '' + car.model}
								</Typography>
								<Typography variant="h4" gutterBottom>
									${car.price}
								</Typography>
								<Typography variant="body2" color="textSecondary">
									{car.year}
								</Typography>
								<Typography variant="body2" color="textSecondary">
									Fuel Type:{car.fuelType}
								</Typography>
								<Typography variant="body2" color="textSecondary">
									Kms:{car.kilometers}
								</Typography>
								<Typography variant="body1" color="textSecondary">
									{car.details}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const id = ctx.params.id;
	const db = await openDB();
	const car = await db.get<CarModel | undefined>('SELECT * FROM Car where id = ?', id);
	return {
		props: { car: car || null }
	};
};
