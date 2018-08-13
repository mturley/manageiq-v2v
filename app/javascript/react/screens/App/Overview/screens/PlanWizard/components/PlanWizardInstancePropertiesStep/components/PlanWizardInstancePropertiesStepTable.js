import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash.orderby';
import * as sort from 'sortabular';
import * as resolve from 'table-resolver';
import { compose } from 'recompose';
import { paginate, Grid, PaginationRow, Table, PAGINATION_VIEW } from 'patternfly-react';

class PlanWizardInstancePropertiesStepTable extends React.Component {
  constructor(props) {
    super(props);

    const { rows } = this.props;

    const getSortingColumns = () => this.state.sortingColumns || {};

    const sortableTransform = sort.sort({
      getSortingColumns,
      onSort: selectedColumn => {
        this.setState({
          sortingColumns: sort.byColumn({
            sortingColumns: this.state.sortingColumns,
            sortingOrder: Table.defaultSortingOrder,
            selectedColumn
          })
        });
      },
      // Use property or index dependening on the sortingColumns structure specified
      strategy: sort.strategies.byProperty
    });

    const sortingFormatter = sort.header({
      sortableTransform,
      getSortingColumns,
      strategy: sort.strategies.byProperty
    });

    // enables our custom header formatters extensions to reactabular
    this.customHeaderFormatters = Table.customHeaderFormattersDefinition;

    this.state = {
      // Sort the first column in an ascending way by default.
      sortingColumns: {
        name: {
          direction: Table.TABLE_SORT_DIRECTION.ASC,
          position: 0
        }
      },

      // column definitions
      columns: [
        {
          property: 'name',
          header: {
            label: __('VM Name'),
            props: {
              index: 0,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [Table.sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 1
            },
            formatters: [Table.tableCellFormatter]
          }
        },
        {
          property: 'cluster',
          header: {
            label: __('Source Cluster'),
            props: {
              index: 1,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [Table.sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 2
            },
            formatters: [Table.tableCellFormatter]
          }
        },
        {
          property: 'allocated_size',
          header: {
            label: __('Allocated Size'),
            props: {
              index: 2,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [Table.sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 4
            },
            formatters: [Table.tableCellFormatter]
          }
        }
        // TODO [mturley] add column OpenStack Security Group
        // TODO [mturley] add column OpenStack Flavor
        // TODO [mturley] add column with edit button
      ],

      // rows state
      rows,

      // pagination default states
      pagination: {
        page: 1,
        perPage: 5,
        perPageOptions: [5, 10, 15]
      },

      // page input value
      pageChangeValue: 1
    };
  }
  onFirstPage = () => {
    this.setPage(1);
  };
  onLastPage = () => {
    const { page } = this.state.pagination;
    const totalPages = this.totalPages();
    if (page < totalPages) {
      this.setPage(totalPages);
    }
  };
  onNextPage = () => {
    const { page } = this.state.pagination;
    if (page < this.totalPages()) {
      this.setPage(this.state.pagination.page + 1);
    }
  };
  onPageInput = e => {
    this.setState({ pageChangeValue: e.target.value });
  };
  onPerPageSelect = (eventKey, e) => {
    const newPaginationState = Object.assign({}, this.state.pagination);
    newPaginationState.perPage = eventKey;
    newPaginationState.page = 1;
    this.setState({ pagination: newPaginationState });
  };
  onPreviousPage = () => {
    if (this.state.pagination.page > 1) {
      this.setPage(this.state.pagination.page - 1);
    }
  };

  onSubmit = () => {
    this.setPage(this.state.pageChangeValue);
  };

  setPage = value => {
    const page = Number(value);
    if (!Number.isNaN(value) && value !== '' && page > 0 && page <= this.totalPages()) {
      const newPaginationState = Object.assign({}, this.state.pagination);
      newPaginationState.page = page;
      this.setState({ pagination: newPaginationState, pageChangeValue: page });
    }
  };

  currentRows = () => {
    const { sortingColumns, columns, pagination, rows } = this.state;

    return compose(
      paginate(pagination),
      sort.sorter({
        columns,
        sortingColumns,
        sort: orderBy,
        strategy: sort.strategies.byProperty
      })
    )(rows);
  };

  totalPages = () => {
    const { rows } = this.state;
    const { perPage } = this.state.pagination;
    return Math.ceil(rows.length / perPage);
  };

  render() {
    const { columns, pagination, sortingColumns, pageChangeValue } = this.state;

    const sortedPaginatedRows = this.currentRows();

    return (
      <Grid fluid>
        <h2>{__('VMs Selected for Migration')}</h2>
        <br />
        <Table.PfProvider
          striped
          bordered
          hover
          dataTable
          columns={columns}
          components={{
            header: {
              cell: cellProps =>
                this.customHeaderFormatters({
                  cellProps,
                  columns,
                  sortingColumns,
                  rows: sortedPaginatedRows.rows,
                  onSelectAllRows: this.onSelectAllRows
                })
            }
          }}
        >
          <Table.Header headerRows={resolve.headerRows({ columns })} />
          <Table.Body rows={sortedPaginatedRows.rows || []} rowKey="id" />
        </Table.PfProvider>
        <PaginationRow
          viewType={PAGINATION_VIEW.TABLE}
          pagination={pagination}
          pageInputValue={pageChangeValue}
          amountOfPages={sortedPaginatedRows.amountOfPages}
          itemCount={sortedPaginatedRows.itemCount}
          itemsStart={sortedPaginatedRows.itemsStart}
          itemsEnd={sortedPaginatedRows.itemsEnd}
          onPerPageSelect={this.onPerPageSelect}
          onFirstPage={this.onFirstPage}
          onPreviousPage={this.onPreviousPage}
          onPageInput={this.onPageInput}
          onNextPage={this.onNextPage}
          onLastPage={this.onLastPage}
          onSubmit={this.onSubmit}
        />
      </Grid>
    );
  }
}
PlanWizardInstancePropertiesStepTable.propTypes = {
  rows: PropTypes.array
};
PlanWizardInstancePropertiesStepTable.defaultProps = {
  rows: []
};
export default PlanWizardInstancePropertiesStepTable;
