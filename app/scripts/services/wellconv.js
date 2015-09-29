'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.wellConversion
 * @description
 * # wellConversion
 * Service in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator')
  .service('WellConv', function () {

    /*
     Data layer:
     letters (row) map to 0-indexed (mapped to letter array),
     numbers (column) map to 1-indexed (for easier handling from UI)
     */

    var letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

    //given a row and a col number, convert to alphanum (e.g.
    function colRowToAlphanumeric (row, col) {
      return letters[row] + '' + col;
    }

    //Given well-formed alphanum (e.g. B5) returns an array in form [row, col] (e.g. [1,5])
    function alphanumericToColRow (alphanum) {
      var split  = alphanum.split('');
      return [_.indexOf(letters, split[0].toUpperCase()), split[1]];
    }

    //Get truthy keys from well map
    function getSelectedWellsArray (wellMap) {
      return _.keys(_.pick(wellMap, _.identity));
    }

    //given two arrays (rows, cols), each with numeric indices for a start and end, generate all wells between
    //e.g. given [0,2], [4,5], generates alphanums from A2 - E5
    //note that you basically are passing in (Y, X), as letter should come first
    function createMapGivenBounds (topleft, bottomright) {
      var grid = {};

      for (var r = topleft[0]; r <= bottomright[0]; r++) {
        for (var c = topleft[1]; c <= bottomright[1]; c++) {
          grid[(colRowToAlphanumeric(r, c))] = true;
        }
      }

      return grid;
    }

    //given two arrays (rows, cols), each with numeric indices for a start and end, generate all wells between
    //e.g. given [0,2], [4,5], generates alphanums from A2 - E5
    //note that you basically are passing in (Y, X), as letter should come first
    function createArrayGivenBounds (topleft, bottomright) {
      return _.keys(createMapGivenBounds(topleft, bottomright));
    }

    //given start and end alphanums, returns an array of alphanums selected
    function findSetSelected(start, end) {
      var starts = alphanumericToColRow(start),
          ends = alphanumericToColRow(end),
          rows = [starts[0], ends[0]].sort(),
          cols = [starts[1], ends[1]].sort(),
          topleft = [rows[0], cols[0]],
          bottomright = [rows[1], cols[1]];

      return createArrayGivenBounds(topleft, bottomright);
    }

    /**
     * @name toggleWells
     * @description
     * Given a map, and array of well alphanums, toggle or set to a forced value
     * @param wellMap {Object}
     * @param selectedWells {Array}
     * @param forceValue
     * @returns {Object} modified Map
     */
    function toggleWells(wellMap, selectedWells, forceValue) {
      _.forEach(selectedWells, function (val) {
        wellMap[val] = _.isUndefined(forceValue) ? !wellMap[val] : forceValue;
      });
      return wellMap;
    }

    return {
      letters : letters,
      colRowToAlphanumeric : colRowToAlphanumeric,
      alphanumericToColRow : alphanumericToColRow,
      getSelectedWellsArray : getSelectedWellsArray,
      createMapGivenBounds : createMapGivenBounds,
      createArrayGivenBounds : createArrayGivenBounds,
      findSetSelected : findSetSelected,
      toggleWells : toggleWells
    }

  });
