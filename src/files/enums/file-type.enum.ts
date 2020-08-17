export enum FileType {
  // TODO: Determine if this first category should be split in two or remain as only one
  //* In case of an accidental deletion of professorship's user, it could be useful to
  //* have another category to identify rapidly which files should change its owner to
  //* the eventual new user created.
  SYSTEM = 'system', //* Admin + Campus + Professorship

  TEMPORARY = 'temporary', //* Student + Scholarship
}
