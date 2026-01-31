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
  nom?: string;
  fonts?: number[];
  vars?: Record<string, string>;
  body?: Record<string, string>;
  h1?: Record<string, string>;
  h2?: Record<string, string>;
  h3?: Record<string, string>;
  h4?: Record<string, string>;
  h5?: Record<string, string>;
  h6?: Record<string, string>;
  div?: Record<string, string>;
  p?: Record<string, string>;
  ch_btn?: Record<string, string>;
  ch_btn_primary?: Record<string, string>;
  ch_btn_info?: Record<string, string>;
  ch_btn_warning?: Record<string, string>;
  ch_btn_success?: Record<string, string>;
  ch_btn_danger?: Record<string, string>;
  ch_btn_hover?: Record<string, string>;
  ch_btn_disabled?: Record<string, string>;
  ch_btn_primary_hover?: Record<string, string>;
  ch_btn_primary_disabled?: Record<string, string>;
  ch_btn_info_hover?: Record<string, string>;
  ch_btn_info_disabled?: Record<string, string>;
  ch_btn_warning_hover?: Record<string, string>;
  ch_btn_warning_disabled?: Record<string, string>;
  ch_btn_success_hover?: Record<string, string>;
  ch_btn_success_disabled?: Record<string, string>;
  ch_btn_danger_hover?: Record<string, string>;
  ch_btn_danger_disabled?: Record<string, string>;
  ch_btn_sm?: Record<string, string>;
  ch_btn_lg?: Record<string, string>;
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
