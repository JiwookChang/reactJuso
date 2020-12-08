import React from "react";
import { Link, match } from "react-router-dom";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import Divider from "@material-ui/core/Divider";
import PageBase from "../components/PageBase";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { getAction } from "../actions/tpo";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import { thunkTpoApiCall, thunkTpoApiQCall } from "../services/thunks";
import { Tpo,  Category } from "../types";
import { LinearProgress, Grid, MenuItem } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import {
  ApiAction,
  UPDATE_TPO,
  CREATE_TPO,
  EDIT_TPO,
  QActions,
} from "../store/types";
import Alert from "@material-ui/lab/Alert";
import SkeletonForm from "../components/SkeletonForm";
import { formPageStyles } from "../styles";

const styles = formPageStyles;

interface TpoFormProps {
  match: match;
  tpo: Tpo;
  getTpo: typeof thunkTpoApiQCall;
  saveTpo: typeof thunkTpoApiCall;
  categoryList: Category[];
  errorMessage?: string;
  isFetching: boolean;
  deleted: boolean;
  updated: boolean;
}

interface TpoFormState {
  tpo: Tpo;
  snackbarOpen: boolean;
  autoHideDuration: number;
}

class TpoFormPage extends React.Component<
  TpoFormProps,
  TpoFormState
> {
  constructor(props) {
    super(props);
    this.onSnackBarClose = this.onSnackBarClose.bind(this);
  }

  state = {
    tpo: {} as Tpo,
    snackbarOpen: false,
    autoHideDuration: 2000,
  };

  componentDidMount() {
    // @ts-ignore
    const tpoId = this.props.match.params?.id;
    let action: QActions;
    if (tpoId) {
      action = getAction(EDIT_TPO, tpoId) as QActions;
      this.props.getTpo(action);
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.updated !== prevProps.updated &&
      this.props.updated === true
    ) {
      this.setState({ snackbarOpen: true });
    }
  }

  onSnackBarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  onSave(values: TODO) {
    const tpo = { ...this.state.tpo, ...values };
    let action: ApiAction; 
    if (tpo.id > 0) {
      action = getAction(UPDATE_TPO, null, tpo) as ApiAction;
    } else {
      action = getAction(CREATE_TPO, null, tpo) as ApiAction;
    }
    this.props.saveTpo(action);
  }

  render() {
    const { categoryList, tpo, isFetching } = this.props;

    return (
      <PageBase title="Tpo" navigation="Application / Tpo ">
        {isFetching ? (
          <div>
            <SkeletonForm />
          </div>
        ) : (
          <Formik
            initialValues={{
              ...tpo,
            }}
            validate={(values) => {
              const errors: Partial<Tpo> = {};
              if (!values.tpoNm) {
                errors.tpoNm = "Required";
              }
              if (!values.categoryId) {
                errors.categoryId = "Required";
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              this.onSave(values);
              setTimeout(() => {
                setSubmitting(false);
              }, 500);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Grid container style={styles.container} spacing={3}>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      select
                      component={TextField}
                      as="select"
                      label="Category"
                      placeholder="Category"
                      variant="outlined"
                      fullWidth={true}
                      name="categoryId"
                    >
                      {categoryList.map((category, index) => (
                        <MenuItem
                          key={index}
                          value={category.id}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      variant="outlined"
                      component={TextField}
                      placeholder="Tpo Name"
                      label="Tpo Name"
                      name="tpoNm"
                      fullWidth={true}
                      required
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      variant="outlined"
                      component={TextField}
                      placeholder="Tpo Type Name"
                      label="Tpo Type Name"
                      fullWidth={true}
                      name="tpoTypeNm"
                      required
                    />
                  </Grid>
                  <Grid item style={styles.cell} xs={12} md={4}>
                    <Field
                      variant="outlined"
                      component={TextField}
                      placeholder="Mgmt Tpo Code"
                      label="Mgmt Tpo Code"
                      fullWidth={true}
                      name="mgmtTpoCd"
                      required
                    />
                  </Grid>

                  <Grid item style={styles.cell} xs={12} md={4}>
                    {tpo && tpo.avatar && (
                      <Card style={styles.card}>
                        <img width={100} src={tpo.avatar} alt="avatar"/>
                      </Card>
                    )}
                  </Grid>
                </Grid>
                <br />
                <Divider />
                {isSubmitting && <LinearProgress />}
                <br />

                <div style={styles.buttons}>
                  <Link to="/tpo">
                    <Button variant="contained">
                      <ArrowBackIosIcon /> Back{" "}
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    style={styles.saveButton}
                    onClick={submitForm}
                    color="primary"
                    disabled={isSubmitting}
                  >
                    <SaveIcon /> Save
                  </Button>
                </div>
                <Snackbar
                  open={this.state.snackbarOpen}
                  autoHideDuration={this.state.autoHideDuration}
                  onClose={this.onSnackBarClose}
                >
                  <Alert onClose={this.onSnackBarClose} severity="success">
                    The operation completed successfully !
                  </Alert>
                </Snackbar>
              </Form>
            )}
          </Formik>
        )}
      </PageBase>
    );
  }
}

function mapStateToProps(state) {
  const { tpo, isFetching, categoryList, deleted, updated } = state.tpo;

  return {
    tpo,
    isFetching,
    categoryList,
    deleted,
    updated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTpo: (action) => dispatch(thunkTpoApiQCall(action)),
    saveTpo: (action) => dispatch(thunkTpoApiCall(action)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TpoFormPage);
