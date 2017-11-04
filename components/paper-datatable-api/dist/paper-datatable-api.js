'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DtPaperDatatableApi = function () {
  function DtPaperDatatableApi() {
    _classCallCheck(this, DtPaperDatatableApi);
  }

  _createClass(DtPaperDatatableApi, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'paper-datatable-api';
      this.properties = {
        /**
         * The columns element.
         */
        _columns: {
          type: Array,
          value: function value() {
            return [];
          }
        },
        /**
         * The list of hideable columns.
         * It is exposed to create a list of label (see demo/advance-demo.html).
         */
        toggleColumns: {
          type: Array,
          notify: true,
          value: []
        },
        /**
         * Contains the data which will be displayed in the table.
         */
        data: {
          type: Array,
          observer: '_dataChanged'
        },
        /**
         * If true, the pagination will be activated.
         */
        paginate: {
          type: Boolean,
          value: false
        },
        /**
         * The current page.
         */
        page: {
          type: Number,
          notify: true,
          observer: '_pageChanged'
        },
        /**
         * The current size.
         */
        size: {
          type: Number,
          notify: true
        },
        /**
         * If true, a filter on each column is added.
         */
        filters: {
          type: Boolean,
          value: false
        },
        /**
         * The total of elements have to be provided in case of pagination, it is mandatory.
         */
        totalElements: Number,
        /**
         * The total of pages have to be provided in case of pagination, it is mandatory.
         * It is used to compute the footer.
         */
        totalPages: Number,
        /**
         * The available size in case of pagination.
         */
        availableSize: {
          type: Array,
          value: [10]
        },
        /**
         * If true, the rows may be selectable.
         */
        selectable: {
          type: Boolean,
          value: false
        },
        /**
         * If false, the paper-checkbox in the header which allow to select all rows is hidden.
         */
        allowTheSelectionOfAllTheElements: {
          type: Boolean,
          value: true
        },
        /**
         * Contains the positions of selected columns.
         * Can contain a specific data if selectableDataKey is setted.
         */
        selectedRows: {
          type: Array,
          value: function value() {
            return [];
          },
          notify: true
        },
        /**
         * If it is setted, the selected rows are persistant (throught the pages).
         * Uses the value of the rowData following the defined key.
         */
        selectableDataKey: {
          type: String
        },
        /**
         * Change the position of the sort icon in the header.
         */
        positionSortIcon: {
          type: String,
          value: 'left'
        },
        language: {
          type: String,
          value: 'en'
        },
        /**
         * If it is setted, the date picker is localized with this object.
         * See https://vaadin.com/docs/-/part/elements/vaadin-date-picker/vaadin-date-picker-localization.html.
         */
        localeDatePicker: {
          type: Object
        },
        resources: {
          notify: true,
          value: function value() {
            return {
              en: {
                rowPerPage: 'Rows per page',
                of: 'of'
              },
              'en-en': {
                rowPerPage: 'Rows per page',
                of: 'of'
              },
              'en-US': {
                rowPerPage: 'Rows per page',
                of: 'of'
              },
              'en-us': {
                rowPerPage: 'Rows per page',
                of: 'of'
              },
              fr: {
                rowPerPage: 'Ligne par page ',
                of: 'sur'
              },
              'fr-fr': {
                rowPerPage: 'Ligne par page ',
                of: 'sur'
              }
            };
          }
        },
        /**
         * Change the position of the footer.
         */
        footerPosition: {
          type: String,
          value: 'right'
        },
        /**
         * Checkbox column position.
         */
        checkboxColumnPosition: {
          type: Number,
          value: 0
        },
        _dragEnd: {
          type: Boolean,
          value: true
        },
        /**
         * Order of the columns
         */
        propertiesOrder: {
          type: Array,
          value: [],
          notify: true
        },
        /**
         * The number of the previous page
         */
        oldPage: {
          type: Number,
          notify: true
        }
      };
    }
  }, {
    key: 'attached',
    value: function attached() {
      var userLang = navigator.language || navigator.userLanguage;
      this.language = userLang;
    }
  }, {
    key: 'equals',
    value: function equals(targetedValue, value) {
      return value === targetedValue;
    }
  }, {
    key: '_generateClass',
    value: function _generateClass(filters, paginate) {
      if (filters && paginate) {
        return 'paginate filters';
      }
      if (filters) {
        return 'filters';
      }
      if (paginate) {
        return 'paginate';
      }
      return '';
    }
  }, {
    key: '_init',
    value: function _init(data, propertiesOrder) {
      var _this = this;

      this._changeColumn(propertiesOrder, function () {
        _this.async(function () {
          _this._removeRows();
          _this._fillRows(data);
          _this._fillColumns();
          _this._footerPositionChange(_this.footerPosition);
          _this._handleDragAndDrop();
        });
      });
    }
  }, {
    key: '_dataChanged',
    value: function _dataChanged(data) {
      if (this._observer) {
        Polymer.dom(this).unobserveNodes(this._observer);
      }
      this._observer = Polymer.dom(this).observeNodes(this._setColumns.bind(this));
      this._init(data, this.propertiesOrder);
    }
  }, {
    key: '_pageChanged',
    value: function _pageChanged(page, oldPage) {
      this.oldPage = oldPage;
    }
  }, {
    key: '_removeRows',
    value: function _removeRows() {
      var _this2 = this;

      var pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');
      pgTrs.forEach(function (pgTr) {
        return Polymer.dom(_this2.$$('tbody')).removeChild(pgTr);
      });
    }
  }, {
    key: '_fillRows',
    value: function _fillRows(data) {
      var _this3 = this;

      if (data) {
        data.forEach(function (rowData) {
          var trLocal = document.createElement('tr');
          trLocal.rowData = rowData;
          trLocal.className = 'paper-datatable-api-tr';

          _this3.listen(trLocal, 'mouseover', 'onOverTr');
          _this3.listen(trLocal, 'mouseout', 'onOutTr');

          Polymer.dom(_this3.$$('tbody')).appendChild(trLocal);
        });
      }
    }
  }, {
    key: 'onOverTd',
    value: function onOverTd(e) {
      this.fire('td-over', e.currentTarget);
    }
  }, {
    key: 'onOutTd',
    value: function onOutTd(e) {
      this.fire('td-out', e.currentTarget);
    }
  }, {
    key: 'onOverTr',
    value: function onOverTr(e) {
      this.fire('tr-over', e.currentTarget);
    }
  }, {
    key: 'onOutTr',
    value: function onOutTr(e) {
      this.fire('tr-out', e.currentTarget);
    }
  }, {
    key: '_findSelectableElement',
    value: function _findSelectableElement(rowData) {
      var splittedSelectableDataKey = this.selectableDataKey.split('.');
      var selectedRow = rowData;
      splittedSelectableDataKey.forEach(function (selectableDataKey) {
        selectedRow = selectedRow[selectableDataKey];
      });

      return selectedRow;
    }
  }, {
    key: '_fillColumns',
    value: function _fillColumns() {
      var _this4 = this;

      var pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');

      pgTrs.forEach(function (pgTr, i) {
        var rowData = pgTr.rowData;

        _this4._columns.forEach(function (paperDatatableApiColumn, p) {
          if (_this4.selectable && p === _this4.checkboxColumnPosition) {
            var tdSelectable = document.createElement('td');
            tdSelectable.className = 'selectable';
            var paperCheckbox = document.createElement('paper-checkbox');
            _this4.listen(paperCheckbox, 'change', '_selectChange');
            paperCheckbox.rowData = rowData;
            paperCheckbox.rowIndex = i;

            if (_this4.selectableDataKey !== undefined) {
              var selectedRow = _this4._findSelectableElement(rowData);
              if (selectedRow !== undefined && _this4.selectedRows.indexOf(selectedRow) !== -1) {
                paperCheckbox.checked = true;
              }
            }

            Polymer.dom(tdSelectable).appendChild(paperCheckbox);
            Polymer.dom(pgTr).appendChild(tdSelectable);
            Polymer.dom.flush();
          }

          var valueFromRowData = _this4._extractData(rowData, paperDatatableApiColumn.property);

          var otherPropertiesValue = {};
          paperDatatableApiColumn.otherProperties.forEach(function (property) {
            otherPropertiesValue[property] = _this4._extractData(rowData, property);
          });

          var tdLocal = document.createElement('td');
          if (paperDatatableApiColumn.tdCustomStyle) {
            tdLocal.classList.add('customTd');
          }

          _this4.listen(tdLocal, 'mouseover', 'onOverTd');
          _this4.listen(tdLocal, 'mouseout', 'onOutTd');

          var template = paperDatatableApiColumn.fillTemplate(valueFromRowData, otherPropertiesValue);

          if (paperDatatableApiColumn.hideable && paperDatatableApiColumn.hidden) {
            tdLocal.style.display = 'none';
          }

          Polymer.dom(tdLocal).appendChild(template.root);
          Polymer.dom(pgTr).appendChild(tdLocal);
        });
      });
    }
  }, {
    key: '_selectAllCheckbox',
    value: function _selectAllCheckbox(event) {
      var _this5 = this;

      var localTarget = Polymer.dom(event).localTarget;
      var allPaperCheckbox = Polymer.dom(this.root).querySelectorAll('tbody tr td paper-checkbox');
      allPaperCheckbox.forEach(function (paperCheckboxParams) {
        var paperCheckbox = paperCheckboxParams;
        if (localTarget.checked) {
          if (!paperCheckbox.checked) {
            paperCheckbox.checked = true;
            _this5._selectChange(paperCheckbox);
          }
        } else if (paperCheckbox.checked) {
          paperCheckbox.checked = false;
          _this5._selectChange(paperCheckbox);
        }
      });
    }

    /**
     * Check the checkbox
     *
     * @property selectRow
     * @param {String} value The value of the row following the selectableDatakey.
     */

  }, {
    key: 'selectRow',
    value: function selectRow(value) {
      var _this6 = this;

      var table = this.$$('table');
      var allTr = table.querySelectorAll('tbody tr');
      allTr.forEach(function (tr) {
        var selectedRow = _this6._findSelectableElement(tr.rowData);

        if (selectedRow === value) {
          var checkbox = tr.querySelector('paper-checkbox');
          if (checkbox) {
            checkbox.checked = true;

            var rowId = checkbox.rowIndex;
            if (_this6.selectableDataKey !== undefined && selectedRow !== undefined) {
              rowId = selectedRow;
            }
            _this6.push('selectedRows', rowId);
            tr.classList.add('selected');
          }
        }
      });
    }
  }, {
    key: '_selectChange',
    value: function _selectChange(event) {
      var localTarget = void 0;
      if (event.type && event.type === 'change') {
        localTarget = Polymer.dom(event).localTarget;
      } else {
        localTarget = event;
      }

      var tr = Polymer.dom(localTarget).parentNode.parentNode;

      var rowData = localTarget.rowData;

      var rowId = localTarget.rowIndex;

      if (this.selectableDataKey !== undefined) {
        var selectedRow = this._findSelectableElement(rowData);
        if (selectedRow) {
          rowId = selectedRow;
        }
      }

      var eventData = {};
      if (localTarget.checked) {
        this.push('selectedRows', rowId);
        eventData = {
          selected: [rowId],
          data: rowData
        };
        tr.classList.add('selected');
      } else {
        this.splice('selectedRows', this.selectedRows.indexOf(rowId), 1);
        eventData = {
          deselected: [rowId],
          data: rowData
        };
        tr.classList.remove('selected');
      }

      /**
       * Fired when a row is selected.
       * @event selection-changed
       * Event param: {{node: Object}} detail Contains selected id and row data.
       */
      this.fire('selection-changed', eventData);
    }
  }, {
    key: '_extractData',
    value: function _extractData(rowData, columnProperty) {
      if (columnProperty) {
        var splittedProperties = columnProperty.split('.');
        if (splittedProperties.length > 1) {
          return splittedProperties.reduce(function (prevRow, property) {
            if (typeof prevRow === 'string' && rowData[prevRow] && rowData[prevRow][property]) {
              return rowData[prevRow][property];
            }

            return prevRow[property] || '';
          });
        }
        return rowData[columnProperty];
      }
      return null;
    }
  }, {
    key: '_setColumns',
    value: function _setColumns() {
      var generateTr = false;

      if (this._columns.length > 0) {
        generateTr = true;
      }

      this._columns = this.queryAllEffectiveChildren('paper-datatable-api-column').map(function (columnParams, i) {
        var column = columnParams;
        column.position = i;
        return column;
      });

      if (this.propertiesOrder.length === 0) {
        this._generatePropertiesOrder();
      }

      this.toggleColumns = this._columns.filter(function (column) {
        return column.hideable || column.draggableColumn;
      });

      this._columnsHeight = this.selectable ? this._columns.length + 1 : this._columns.length;
      if (generateTr) {
        this._init(this.data);
      }
    }

    /**
     * Hide or show a column following the number in argument.
     *
     * @property toggleColumn
     * @param {Number} columnProperty The property of the column which will be toggled.
     */

  }, {
    key: 'toggleColumn',
    value: function toggleColumn(columnProperty) {
      var column = this._columns.find(function (columnElement) {
        return columnElement.property === columnProperty;
      });
      var index = this._columns.findIndex(function (columnElement) {
        return columnElement.property === columnProperty;
      });
      if (column && column.hideable) {
        var isHidden = column.hidden;
        var indexColumn = this.selectable ? index + 2 : index + 1;
        var cssQuery = 'thead tr th:nth-of-type(' + indexColumn + '), tbody tr td:nth-of-type(' + indexColumn + ')';
        Polymer.dom(this.root).querySelectorAll(cssQuery).forEach(function (tdThParams) {
          var tdTh = tdThParams;
          tdTh.style.display = isHidden ? 'table-cell' : 'none';
        });

        column.hidden = !isHidden;
        var toggleColumnIndex = this.toggleColumns.findIndex(function (toggleColumn) {
          return toggleColumn.property === columnProperty;
        });

        this.set('toggleColumns.' + toggleColumnIndex + '.hidden', !isHidden);
      }
    }
  }, {
    key: '_getThDisplayStyle',
    value: function _getThDisplayStyle(hidden) {
      if (hidden) {
        return 'none';
      }

      return 'table-cell';
    }
  }, {
    key: '_handleSort',
    value: function _handleSort(event) {
      var column = event.detail.column;
      var paperDatatableApiThContent = event.currentTarget;
      var th = paperDatatableApiThContent.parentNode;
      var sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';

      if (column.sortDirection === undefined || column.sortDirection === 'asc') {
        this.sortColumn(column, sortDirection, th);

        /**
         * Fired when a column is sorted.
         * @event sort
         * Event param: {{node: Object}} detail Contains sort object.
         * { sort: { property: STRING, direction: asc|desc }, column: OBJECT }
         */
        this.fire('sort', {
          sort: {
            property: column.property,
            direction: column.sortDirection
          },
          column: column
        });
      } else {
        this.deleteSortColumn(column, th);
      }
    }

    /**
     * Undo sort on a column if it is sorted.
     *
     * @property deleteSortColumn
     * @param {Object} column Column element.
     * @param {th} column Th element.
     */

  }, {
    key: 'deleteSortColumn',
    value: function deleteSortColumn(column, targetTh) {
      if (column.sortable && column.sorted) {
        var th = targetTh;

        if (!th) {
          th = Polymer.dom(this.root).querySelector('thead th[property="' + column.property + '"]');
        }

        if (th) {
          var thContent = Polymer.dom(th).querySelector('paper-datatable-api-th-content');
          thContent.setAttribute('sort-direction', 'asc');
          thContent.removeAttribute('sorted');
          column.set('sortDirection', undefined);
          column.set('sorted', false);
        }

        this.fire('sort', {
          sort: {},
          column: column
        });
      }
    }

    /**
     * Sort a column if it is sortable.
     *
     * @property sortColumn
     * @param {Object} column Column element.
     * @param {sortDirection} The sort direction.
     * @param {th} column Th element.
     */

  }, {
    key: 'sortColumn',
    value: function sortColumn(column, sortDirection, targetTh) {
      if (column && column.sortable) {
        var th = targetTh;
        var queryThContent = 'thead th paper-datatable-api-th-content[sortable][sorted]';
        Polymer.dom(this.root).querySelectorAll(queryThContent).forEach(function (otherThContent) {
          var thSorted = otherThContent.parentNode;

          if (thSorted.dataColumn !== column) {
            otherThContent.setAttribute('sort-direction', 'asc');
            otherThContent.removeAttribute('sorted');
            thSorted.dataColumn.set('sortDirection', undefined);
            thSorted.dataColumn.set('sorted', false);
          }
        });

        if (!th) {
          th = Polymer.dom(this.root).querySelector('thead th[property="' + column.property + '"]');
        }

        if (th) {
          var thContent = Polymer.dom(th).querySelector('paper-datatable-api-th-content');
          thContent.setAttribute('sort-direction', sortDirection);
          thContent.setAttribute('sorted', true);
          column.set('sortDirection', sortDirection);
          column.set('sorted', true);
        }
      }
    }
  }, {
    key: '_handleVaadinDatePickerLight',
    value: function _handleVaadinDatePickerLight(event) {
      var _this7 = this;

      var column = event.detail.column;
      var value = event.detail.value;

      this.async(function () {
        _this7._launchFilterEvent(value, column);
      });
    }
  }, {
    key: '_toggleFilter',
    value: function _toggleFilter(column) {
      Polymer.dom.flush();
      var columnIndex = this._columns.findIndex(function (_column) {
        return _column.property === column.property;
      });

      if (column.activeFilter) {
        this.set('_columns.' + columnIndex + '.activeFilter', false);
      } else {
        this.set('_columns.' + columnIndex + '.activeFilter', true);
      }
    }

    /**
     * Active filter on a column.
     *
     * @property activeFilter
     * @param {Object} column The column where the filer will be applied.
     * @param {String} value The value of the filter.
     */

  }, {
    key: 'activeFilter',
    value: function activeFilter(column, value) {
      var _this8 = this;

      if (column) {
        var columnIndex = this._columns.findIndex(function (_column) {
          return _column.property === column.property;
        });
        this.set('_columns.' + columnIndex + '.activeFilter', true);
        this.fire('filter', {
          filter: {
            property: column.property,
            value: value
          },
          column: column
        });
        this.async(function () {
          if (value) {
            _this8.set('_columns.' + columnIndex + '.activeFilterValue', value);
          }
        }, 100);
      }
    }

    /**
     * Toggle filter on a column.
     *
     * @property toggleFilter
     * @param {Object} column The column where the filer will be applied.
     * @param {String} value The value of the filter.
     */

  }, {
    key: 'toggleFilter',
    value: function toggleFilter(column, value) {
      var _this9 = this;

      if (column) {
        this._toggleFilter(column);
        this.fire('filter', {
          filter: {
            property: column.property,
            value: value
          },
          column: column
        });
        this.async(function () {
          if (value) {
            var columnIndex = _this9._columns.findIndex(function (_column) {
              return _column.property === column.property;
            });
            _this9.set('_columns.' + columnIndex + '.activeFilterValue', value);
          }
        }, 100);
      }
    }
  }, {
    key: '_launchFilterEvent',
    value: function _launchFilterEvent(value, column) {
      /**
       * Fired when a filters inputs changed.
       * @event filter
       * Event param: {{node: Object}} detail Contains sort object.
       * { filter: { property: STRING, value: STRING }, column: OBJECT }
       */
      this.fire('filter', {
        filter: {
          property: column.property,
          value: value
        },
        column: column
      });
    }
  }, {
    key: '_handleFilter',
    value: function _handleFilter(event) {
      var column = event.detail.column;

      if (column.activeFilter) {
        this._launchFilterEvent('', column);
      }
      this._toggleFilter(column);
    }
  }, {
    key: '_handleInputChange',
    value: function _handleInputChange(event) {
      var column = event.detail.column;
      var value = event.detail.value;

      if (column && value !== null && value !== undefined) {
        this._launchFilterEvent(value, column);
      }
    }
  }, {
    key: '_footerPositionChange',
    value: function _footerPositionChange(position) {
      var _this10 = this;

      this.async(function () {
        var footerDiv = Polymer.dom(_this10.root).querySelector('.foot > div > div');

        if (footerDiv) {
          if (position === 'right') {
            footerDiv.classList.add('end-justified');
          } else {
            footerDiv.classList.remove('end-justified');
          }
        }
      });
    }
  }, {
    key: '_addCustomTdClass',
    value: function _addCustomTdClass(isTdCustomStyle) {
      if (isTdCustomStyle) {
        return 'customTd';
      }
      return '';
    }
  }, {
    key: '_handleDragAndDrop',
    value: function _handleDragAndDrop() {
      var _this11 = this;

      var allTh = Polymer.dom(this.root).querySelectorAll('thead th');
      allTh.forEach(function (th) {
        th.addEventListener('dragover', _this11._dragOverHandle.bind(_this11), false);
        th.addEventListener('dragenter', _this11._dragEnterHandle.bind(_this11), false);
        th.addEventListener('drop', _this11._dropHandle.bind(_this11), false);
      });
      var allThDiv = Polymer.dom(this.root).querySelectorAll('thead th paper-datatable-api-th-content');
      allThDiv.forEach(function (div) {
        div.addEventListener('dragstart', _this11._dragStartHandle.bind(_this11), false);
        div.addEventListener('dragend', _this11._dragEndHandle.bind(_this11), false);
      });
    }
  }, {
    key: '_dragEndHandle',
    value: function _dragEndHandle() {
      this.currentDrag = undefined;
    }
  }, {
    key: '_dragEnterHandle',
    value: function _dragEnterHandle(event) {
      event.preventDefault();
      if (event.target.classList && event.target.classList.contains('pgTh')) {
        var from = this.currentDrag;
        var to = event.currentTarget;
        if (this._dragEnd) {
          this._moveTh(from, to);
        }
      }
    }
  }, {
    key: '_dragOverHandle',
    value: function _dragOverHandle(event) {
      event.preventDefault();
    }
  }, {
    key: '_dragStartHandle',
    value: function _dragStartHandle(event) {
      // Hack for firefox
      event.dataTransfer.setData('text/plain', '');

      this.currentDrag = event.currentTarget;
      event.dataTransfer.effectAllowed = 'move';
    }
  }, {
    key: '_insertAfter',
    value: function _insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }, {
    key: '_insertBefore',
    value: function _insertBefore(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }
  }, {
    key: '_insertElement',
    value: function _insertElement(container, toIndex, fromIndex) {
      if (toIndex > fromIndex) {
        this._insertAfter(container[toIndex], container[fromIndex]);
      } else {
        this._insertBefore(container[toIndex], container[fromIndex]);
      }
    }
  }, {
    key: '_moveTh',
    value: function _moveTh(from, to) {
      var _this12 = this;

      var fromProperty = from.parentNode.getAttribute('property');
      var toProperty = to.getAttribute('property');
      if (fromProperty !== toProperty) {
        this.async(function () {
          var allTh = Polymer.dom(_this12.root).querySelectorAll('thead th');
          var toIndex = allTh.findIndex(function (th) {
            return th.getAttribute('property') === toProperty;
          });
          var fromIndex = allTh.findIndex(function (th) {
            return th.getAttribute('property') === fromProperty;
          });
          _this12._insertElement(allTh, toIndex, fromIndex);

          var allTr = Polymer.dom(_this12.root).querySelectorAll('tbody tr');
          allTr.forEach(function (tr) {
            var allTd = Polymer.dom(tr).querySelectorAll('td');
            _this12._insertElement(allTd, toIndex, fromIndex);
          });

          _this12._dragEnd = false;
          _this12.async(function () {
            _this12._dragEnd = true;
          }, 100);
        });
      }
    }
  }, {
    key: '_dropHandle',
    value: function _dropHandle() {
      this._generatePropertiesOrder();
    }
  }, {
    key: '_generatePropertiesOrder',
    value: function _generatePropertiesOrder() {
      var _this13 = this;

      Polymer.dom.flush();
      var allTh = Polymer.dom(this.root).querySelectorAll('thead th');
      var propertiesOrder = allTh.filter(function (th) {
        return th.getAttribute('property') !== null;
      }).map(function (th) {
        return th.getAttribute('property');
      });

      this.propertiesOrder = propertiesOrder;
      this.async(function () {
        return _this13._changeColumn(propertiesOrder, function () {
          return _this13.fire('order-column-change', { propertiesOrder: propertiesOrder });
        });
      }, 100);
    }

    /**
     * Change column order.
     *
     * @property changeColumnOrder
     * @param {Object} propertiesOrder The sorted columns properties.
     */

  }, {
    key: 'changeColumnOrder',
    value: function changeColumnOrder(propertiesOrder) {
      this.propertiesOrder = propertiesOrder;
      this._init(this.data, propertiesOrder);
      this.fire('order-column-change', { propertiesOrder: propertiesOrder });
    }
  }, {
    key: '_changeColumn',
    value: function _changeColumn(propertiesOrder, cb) {
      var _this14 = this;

      if (propertiesOrder) {
        var newColumnsOrder = [];
        propertiesOrder.forEach(function (property) {
          var columnObj = _this14._columns.find(function (column) {
            return column.property === property;
          });
          if (columnObj) {
            newColumnsOrder.push(columnObj);
          }
        });
        if (newColumnsOrder.length > 0) {
          this.splice('_columns', 0, this._columns.length);
          this.async(function () {
            _this14._columns = newColumnsOrder;
            _this14.async(function () {
              _this14._handleDragAndDrop();
              if (cb) {
                cb();
              }
            });
          });
        } else if (cb) {
          cb();
        }
      } else if (cb) {
        cb();
      }
    }

    /**
     * Get a column following his property name.
     *
     * @property getColumn
     * @param {Object} property The property.
     */

  }, {
    key: 'getColumn',
    value: function getColumn(property) {
      return this._columns.find(function (columnElement) {
        return columnElement.property === property;
      });
    }

    /**
     * Scroll to top.
     *
     * @property scrollTopTop
     */

  }, {
    key: 'scrollToTop',
    value: function scrollToTop() {
      Polymer.dom(this.root).querySelector('tbody').scrollTop = 0;
    }
  }, {
    key: 'behaviors',
    get: function get() {
      return [Polymer.AppLocalizeBehavior];
    }
  }]);

  return DtPaperDatatableApi;
}();

Polymer(DtPaperDatatableApi);