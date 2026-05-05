export type FontOption = { id: number; name: string };

export type BodyConfig = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  color: string;
  margin: string;
  padding: string;
};

/** Styles complets d'un bouton (base ou variante) */
export type ButtonConfig = {
  background: string;
  color: string;
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  padding: string;
  margin: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  lineHeight: string;
};

/** Styles de taille uniquement (ch_btn_sm, ch_btn_lg) */
export type ButtonSizeConfig = {
  padding: string;
  fontSize: string;
  lineHeight: string;
};

/** Uniquement les 3 couleurs (hover, disabled) */
export type ButtonColorOnly = {
  background: string;
  color: string;
  borderColor: string;
};

/** JSON du DTO (route /theme/font/{id}) : nom, fonts, vars, body, h1..p, ch_btn… */
export type ThemeConfigJson = {
  name?: string;
  fonts?: number[];
  vars?: Record<string, string>;
  node_overrides?: Record<string, string>;
  body?: Record<string, string>;
  /** CSS personnalisé ajouté à la fin du fichier généré */
  custom_css?: string;
};

export type ThemeFormProps = {
  fonts: FontOption[];
  postUrl: string;
  fieldName: string;
  /** Config complète du thème (JSON du DTO), fournie par la route /theme/font/{id} */
  initialConfig?: ThemeConfigJson | null;
};

export type ThemeVar = {
  id: number;
  name: string;
  value: string;
};
