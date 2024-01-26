export interface UserSchema extends Record<string, unknown> {
  /**The discord user ID */
  userid: bigint;
  //**Steam ID */
  steamid: number;
  //**# of tries to link steam */
  steamtries: number;
  //**Role Level */
  rolelevel: number;
}
