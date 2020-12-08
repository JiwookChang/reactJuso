import React from 'react';
import Fab from '@material-ui/core/Fab';
import ContentAdd from '@material-ui/icons/Add';
import Search from '@material-ui/icons/Search';
import PageBase from '../components/PageBase';
import { connect } from 'react-redux';
import { getAction, fetchingTpo } from '../actions/tpo';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { thunkTpoApiCall, thunkTpoApiQCall } from '../services/thunks';
import { NEW_TPO, LIST_TPO, ApiAction, QActions, DELETE_TPO } from '../store/types';
import { Tpo, SearchFilter } from '../types';
import Alert from '../components/Alert';
import DataTable from '../components/DataTable';
import SkeletonList from '../components/SkeletonList';
import DeleteDialog from '../components/DeleteDialog';
import { listPageStyle } from '../styles';
import { Grid } from '@material-ui/core';
import { clearSearchFilters, buildSearchFilters, buildJsonServerQuery } from '../utils/app-utils';

const styles = listPageStyle;

const defaultProps = {
  model: 'tpo',
  //dataKeys: ['name', 'category.name', 'unitPrice', 'numInStock','actions'],
  dataKeys: ['tpoCd', 'tpoNm', 'tpoTypeNm', 'mgmtTpoCd','actions'],
  headers: ['Tpo Code', 'Tpo Name', 'Tpo Type Nm', 'Mgmt. Tpo Code', 'Actions'],
};

type DefaultProps = typeof defaultProps;

type TpoListProps = {
  pageCount: number;
  isFetching: boolean;
  tpoList: Tpo[];
  searchTpo: typeof thunkTpoApiCall;
  deleteTpo: typeof thunkTpoApiCall;
  newTpo: typeof thunkTpoApiQCall;
  fetchingTpo: () => {};
  deleteSuccess: boolean;
  errorMessage: string;
  deleted: boolean;
} & DefaultProps;

interface TpoListState {
  open: boolean;
  isFetching: boolean;
  searchOpen: boolean;
  snackbarOpen: boolean;
  autoHideDuration: number;
  page: number;
  items: Tpo[];
  tpoList: Tpo[];
  totalPages: number;
  tpoId: number;
  search: {
    contain:{
      name: string;
    }
  };
}

class TpoListPage extends React.Component<TpoListProps, TpoListState> {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onSnackBarClose = this.onSnackBarClose.bind(this);
    this.handleSearchFilter = this.handleSearchFilter.bind(this);
    this.clearSearchFilter = this.clearSearchFilter.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.handleNewTpo = this.handleNewTpo.bind(this);
  }

  static defaultProps = defaultProps;

  state: TpoListState = {
    isFetching: true,
    open: false,
    searchOpen: false,
    snackbarOpen: false,
    autoHideDuration: 2000,
    page: 1,
    items: [],
    totalPages: 1,
    tpoId: null,
    tpoList: [],
    search: {
     contain:{
      name: '',
     }
    },
  };

  /* eslint-disable */
  componentDidMount() {
    this.handleSearch();
  }

  componentDidUpdate(prevProps) {
    // reset page if items array has changed
    if (this.props.tpoList !== prevProps.tpoList) {
      this.setState({ tpoList: this.props.tpoList });
      const page = 1;
      const totalPages = Math.ceil(this.props.tpoList.length / 10);
      const items = this.props.tpoList.slice(0, 10);
      const isFetching = this.props.isFetching;
      this.setState({ page, totalPages, items, isFetching });
    }
    

    if (this.props.deleted !== prevProps.deleted && this.props.deleted === true) {
      this.setState({ snackbarOpen: true });
      this.handleSearch();
    }
  }

  onPageChange(_event: React.ChangeEvent<unknown>, page: number) {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const items = this.props.tpoList.slice(startIndex, endIndex);
    this.setState({ page, items });
  }

  openDialog(_event: React.ChangeEvent<unknown>, value: number) {
    if (value != null && value > 0) {
         this.setState({ open: true , tpoId: value });
    }
  }

  handleToggle() {
    this.setState({ searchOpen: !this.state.searchOpen });
  }

  handleSearch() {
    // const action = getAction(LIST_TPO, null, null, '') as ApiAction;
    // this.props.searchTpo(action); //this.state.search);


    const filters = buildSearchFilters(this.state.search as SearchFilter);
    const query = buildJsonServerQuery(filters);
    // const action = getAction(LIST_CUSTOMER, null, null, query);
    const action = getAction(LIST_TPO, null, null, query) as ApiAction;
    this.props.searchTpo(action); //this.state.search);
    this.setState({ searchOpen: false, isFetching: true });


  }

  closeDialog(isConfirmed) {
    this.setState({ open: false });

    if (isConfirmed && this.state.tpoId) {
      const action = getAction(DELETE_TPO, this.state.tpoId, null, '')as ApiAction
      this.props.deleteTpo(action);
        this.setState({ tpoId: null });
    }
  }

  onSnackBarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  handleNewTpo() {
    this.props.fetchingTpo();

    const action = getAction(NEW_TPO) as QActions;
    this.props.newTpo(action);
    // @ts-ignore
    this.props.history.push('/newtpo');
  }

  handleSearchFilter(event) {
    const field = event.target.name;
    if (event && event.target && field) {
      const search = Object.assign({}, this.state.search);
      search.contain[field] = event.target.value;
      this.setState({ search: search });
    }
  }

  clearSearchFilter() {
    const search = Object.assign({}, this.state.search);
    clearSearchFilters(search as SearchFilter);
    this.setState({ search });
    this.handleSearch()
  }

  render() {
    const { tpoList, headers, dataKeys, model } = this.props;
    const { isFetching, page, totalPages, items } = this.state;

    return (
      <PageBase title={'국사 (' + tpoList.length + ')'} navigation="React Juso / 국사">
        {isFetching ? (
          <div>
            <SkeletonList />
          </div>
        ) : (
          <div>
            <Fab size="small" color="secondary" style={styles.fab} onClick={this.handleNewTpo}>
              <ContentAdd />
            </Fab>
            <Fab size="small" style={styles.fabSearch} onClick={this.handleToggle}>
              <Search />
            </Fab>
            <Snackbar open={this.state.snackbarOpen} autoHideDuration={this.state.autoHideDuration} onClose={this.onSnackBarClose}>
              <Alert onClose={this.onSnackBarClose} severity="success">
                The operation completed successfully !
              </Alert>
            </Snackbar>
            <DataTable
              model={model}
              items={items}
              dataKeys={dataKeys}
              headers={headers}
              page={page}
              totalPages={totalPages}
              onDelete={this.openDialog}
              onPageChange={this.onPageChange}
            />

            <DeleteDialog open={this.state.open} closeDialog={this.closeDialog} />

            <Drawer anchor="right" open={this.state.searchOpen} onClose={this.handleToggle}>
              <Grid container style={styles.searchDrawer} spacing={1}>
                <Grid item xs={12} style={styles.searchField}>
                  <h5>Search</h5>
                </Grid>
                <Grid item xs={12} style={styles.searchField}>
                  <TextField
                    placeholder="Tpo Name"
                    label="Tpo Name"
                    name="name"
                    fullWidth={true}
                    value={this.state.search.contain.name}
                    onChange={this.handleSearchFilter}
                  />
                </Grid>
                <Grid item xs={12} style={styles.searchField}>
                  <Button variant="contained"    style={styles.searchButton} onClick={this.handleSearch} color="secondary">
                    Search
                  </Button>
                  <Button variant="contained"    style={styles.searchButton} onClick={this.clearSearchFilter} color="default" >
                      Cancel
                    </Button>
                </Grid>
              </Grid>
            </Drawer>
          </div>
        )}
      </PageBase>
    );
  }
}

function mapStateToProps(state) {
  const { tpoList,  isFetching,  errorMessage, user, deleted } = state.tpo;

  return {
    tpoList,
    isFetching,
    errorMessage,
  deleted,
    user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchTpo: action => dispatch(thunkTpoApiCall(action)),
    getAllTpos: action => dispatch(thunkTpoApiCall(action)),
    deleteTpo: action => dispatch(thunkTpoApiCall(action)),
    fetchingTpo: () => dispatch(fetchingTpo()),
    newTpo: action => dispatch(thunkTpoApiQCall(action)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TpoListPage);