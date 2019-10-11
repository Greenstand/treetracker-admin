import React, {useState} from 'react'
import Drawer from '@material-ui/core/Drawer';
import compose from 'recompose/compose'
import {withStyles} from '@material-ui/styles'
import Grid		from '@material-ui/core/Grid'
import IconButton		from '@material-ui/core/IconButton'
import Button		from '@material-ui/core/Button'
import IconClose		from '@material-ui/icons/CloseRounded'
import Typography		from '@material-ui/core/Typography'
import TextField		from '@material-ui/core/TextField'
import MenuItem		from '@material-ui/core/MenuItem'
import FilledInput		from '@material-ui/core/FilledInput';
import FormControl		from '@material-ui/core/FormControl';
import FormHelperText		from '@material-ui/core/FormHelperText';
import Input		from '@material-ui/core/Input';
import InputLabel		from '@material-ui/core/InputLabel';
import OutlinedInput		from '@material-ui/core/OutlinedInput';
import FilterModel		from '../models/Filter'
import dateformat		from 'dateformat';
import moment from 'moment';
import GSInputLabel		from './common/InputLabel';
import DateSelector from './DateSelector'


export const FILTER_WIDTH		= 330

const styles = theme => {
	return {
	root		: {
	},
	drawer: {
		flexShrink: 0,
	},
	drawerPaper: {
		width: FILTER_WIDTH,
		padding		: theme.spacing(3, 2, 2, 2),
		/*
		 * boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
		 * */
	},
	close		: {
		color		: theme.palette.grey[500],
	},
	dateInput		: {
		width		: 158,
		fontSize		: 14,
	},
}}

function Filter(props){

	const {classes, filter}		= props
	//console.error('filter:%o', filter)
	// the date defaults may not be needed 
	const dateStartDefault		= `${moment().subtract(10, 'days').calendar()}`
	const dateEndDefault		= `${dateformat(Date.now(), 'yyyy-mm-dd')}`
	const [treeId, setTreeId]		= useState(filter.treeId)
	const [userId, setUserId]		= useState(filter.userId)
	const [deviceId, setDeviceId]		= useState(filter.deviceId)
	const [planterIdentifier, setPlanterIdentifier]		= useState(filter.planterIdentifier)
	const [status, setStatus]		= useState(filter.status)
	const [approved, setApproved]		= useState(filter.approved)
	const [active, setActive]		= useState(filter.active)
	const [dateStart, handleStartDate]		= useState(dateStartDefault || new Date())
	const [dateEnd, handleEndDate]		= useState(dateEndDefault || new Date())
    // const [selectedDate, handleDateChange] = useState(new Date());

	//console.error('the tree id:%d', treeId)

	// function handleDateStartChange(e){
	// 	setDateStart(e.target.value || dateStartDefault)
	// }

	// function handleDateEndChange(e){
	// 	setDateEnd(e.target.value || dateEndDefault)
	// }

	function handleSubmit(){
		const filter		= new FilterModel()
		filter.treeId		= treeId
		filter.userId		= userId
		filter.deviceId		= deviceId
		filter.planterIdentifier		= planterIdentifier
		filter.status		= status
		filter.dateStart		= dateStart
		filter.dateEnd		= dateEnd
		filter.approved		= approved
		filter.active		= active
		props.onSubmit && props.onSubmit(filter)
	}

	function handleCloseClick(){
		props.onClose && props.onClose()
	}

	return (
		<Drawer
			className={classes.drawer}
			classes={{
				paper: classes.drawerPaper,
			}}
			open={props.isOpen}
			variant='persistent'
			anchor='right'
			PaperProps={{
				elevation		: props.isOpen ? 6 : 0,
			}}
		>
			<Grid
				container
				justify='space-between'
			>
				<Grid item>
					<Typography variant='h5'>
						Filters
					</Typography>
				</Grid>
				<Grid item>
					<IconButton 
						color='primary' 
						classes={{
							colorPrimary		: classes.close,
						}}
						onClick={handleCloseClick}
					>
						<IconClose/>
					</IconButton>
				</Grid>
			</Grid>
			<Button
				variant='outlined'
				color='primary'
				onClick={handleSubmit}
			>
				Apply Filters
			</Button>
			<GSInputLabel text='Tree Id' />
			<TextField
				placeholder='e.g. 80'
				InputLabelProps={{
					shrink: true,
				}}
				value={treeId}
				onChange={e => setTreeId(e.target.value)}
			/>
			<GSInputLabel text='User Id' />
			<TextField
				placeholder='user id'
				InputLabelProps={{
					shrink: true,
				}}
				value={userId}
				onChange={e => setUserId(e.target.value)}
			/>
			<GSInputLabel text='Device Id' />
			<TextField
				placeholder='device id'
				InputLabelProps={{
					shrink: true,
				}}
				value={deviceId}
				onChange={e => setDeviceId(e.target.value)}
			/>
			<GSInputLabel text='Planter Identifier' />
			<TextField
				placeholder='planter identifier'
				InputLabelProps={{
					shrink: true,
				}}
				value={planterIdentifier}
				onChange={e => setPlanterIdentifier(e.target.value)}
			/>
			<GSInputLabel text='Status' />
			<TextField
				select
				placeholder='e.g. 80'
				value={status ? status : 'All'}
				InputLabelProps={{
					shrink: true,
				}}
				onChange={e => setStatus(e.target.value === 'All'? '':e.target.value)}
			>
				{['All', 'Planted', 'Hole dug', 'Not a tree', 'Blurry'].map(name =>
					<MenuItem
						key={name}
						value={name}
					>
						{name}
					</MenuItem>
				)} 
			</TextField>
			<GSInputLabel text='Approved' />
			<TextField
				select
				value={
					approved === undefined ? 
					'All' 
					: 
					approved === true? 
						'true'
						:
						'false'}
				InputLabelProps={{
					shrink: true,
				}}
				onChange={e => setApproved(
					e.target.value === 'All'? 
						undefined
						:
						e.target.value === 'true' ?
							true
							:
							false)}
			>
				{['All', 'true', 'false', ].map(name =>
					<MenuItem
						key={name}
						value={name}
					>
						{name}
					</MenuItem>
				)} 
			</TextField>
			<GSInputLabel text='Rejected' />
			<TextField
				select
				value={
					active === undefined ? 
					'All' 
					: 
					active === true? 
						'false'
						:
						'true'}
				InputLabelProps={{
					shrink: true,
				}}
				onChange={e => setActive(
					e.target.value === 'All'? 
						undefined
						:
						e.target.value === 'true' ?
							false
							:
							true)}
			>
				{['All', 'false', 'true', ].map(name =>
					<MenuItem
						key={name}
						value={name}
					>
						{name}
					</MenuItem>
				)} 
			</TextField>
			<GSInputLabel text='Time created' />
			<Grid 
				container
				justify='space-between'
			>
				<Grid item>
					<DateSelector
					dateValue = {dateStart}
					dateOnChange = {handleStartDate}
					/>
				</Grid>
				<Grid item>
					<DateSelector
					dateValue = {dateEnd}
					dateOnChange={handleEndDate}
					/>
				</Grid>
			</Grid>
			
		</Drawer>
	)
}

//export default compose(
//  withStyles(styles, { withTheme: true, name: 'Filter' })
//)(Filter)
export default withStyles(styles)(Filter)
