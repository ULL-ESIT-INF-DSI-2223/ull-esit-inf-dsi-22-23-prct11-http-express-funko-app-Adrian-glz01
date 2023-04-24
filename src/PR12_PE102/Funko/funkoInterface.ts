

/**
 * @description Funko interface
 * @interface Funko
 * @property {number} _id - Funko id
 * @property {string} _name - Funko name
 * @property {string} _description - Funko description
 * @property {Funko_type} _type - Funko type
 * @property {Funko_genre} _genre - Funko genre
 * @property {string} _franchise - Funko franchise
 * @property {number} _franchise_number - Funko franchise number
 * @property {boolean} _exclusive - Funko exclusive
 * @property {string} _especialCaracteristics - Funko especial Caracteristics
 * @property {number} _price - Funko price
 */
export interface Funko {
  _owner: string;
  _ownid?: string;
  _name?: string;
  _description?: string;
  _type?: string;
  _genre?: string;
  _franchise?: string;
  _franchise_number?: string;
  _exclusive?: string;
  _especialCaracteristics?: string;
  _price?: string;
}