import { Record, Union } from "./fable_modules/fable-library.3.7.17/Types.js";
import { record_type, union_type, string_type } from "./fable_modules/fable-library.3.7.17/Reflection.js";
import { Cmd_none, Cmd_ofMsg } from "./fable_modules/Sutil.1.0.0-beta-019/Types.fs.js";
import { empty, ofArray, item } from "./fable_modules/fable-library.3.7.17/List.js";
import { nonSeeded } from "./fable_modules/fable-library.3.7.17/Random.js";
import { Store_map, Store_makeElmish } from "./fable_modules/Sutil.1.0.0-beta-019/Store.fs.js";
import { BulmaEngine$1__get_subtitle, SubtitleEngine$1__h3_BB573A, BulmaEngine$1__get_title, TitleEngine$1__h1_BB573A, BulmaEngine$1__column_BB573A, BulmaEngine$1__columns_BB573A, BulmaEngine$1__container_BB573A, BulmaEngine$1__heroBody_BB573A, BulmaEngine$1__hero_BB573A } from "./fable_modules/Feliz.Engine.Bulma.1.0.0-beta-005/Bulma.fs.js";
import { ColumnModifiersEngine$1__get_isOffset3, ColumnModifiersEngine$1__get_is6, TextModifiersEngine$1__get_hasTextCentered, HeroModifiersEngine$1__get_isFullheight } from "./fable_modules/Feliz.Engine.Bulma.1.0.0-beta-005/Modifiers.fs.js";
import { bulma, column, text, hero } from "./fable_modules/Sutil.1.0.0-beta-019/Bulma.fs.js";
import { onClick, style } from "./fable_modules/Sutil.1.0.0-beta-019/Attr.fs.js";
import { CssEngine$1__get_cursorPointer, CssEngine$1__backgroundColor_Z721C83C5 } from "./fable_modules/Feliz.Engine.1.0.0-beta-004/CssEngine.fs.js";
import { Attr$, Html, Css } from "./fable_modules/Sutil.1.0.0-beta-019/Html.fs.js";
import { BindApi_Bind_fragment } from "./fable_modules/Sutil.1.0.0-beta-019/Bindings.fs.js";
import { HtmlEngine$1__a_BB573A, HtmlEngine$1__text_Z721C83C5 } from "./fable_modules/Feliz.Engine.1.0.0-beta-004/HtmlEngine.fs.js";
import { AttrEngine$1__href_Z721C83C5 } from "./fable_modules/Feliz.Engine.1.0.0-beta-004/AttrEngine.fs.js";
import { mountElement } from "./fable_modules/Sutil.1.0.0-beta-019/Program.fs.js";

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["AdjectiveChanged", "AdjectiveChangeRequested"];
    }
}

export function Msg$reflection() {
    return union_type("App.Msg", [], Msg, () => [[["Item", string_type]], []]);
}

export class Model extends Record {
    constructor(Adjective) {
        super();
        this.Adjective = Adjective;
    }
}

export function Model$reflection() {
    return record_type("App.Model", [], Model, () => [["Adjective", string_type]]);
}

export function getAdjective(m) {
    return m.Adjective;
}

export function init() {
    return [new Model(""), Cmd_ofMsg(new Msg(1))];
}

export function update(msg, model) {
    if (msg.tag === 1) {
        const getAdjective_1 = () => item(nonSeeded().Next1(3), ofArray(["cool", "fun", "fresh", "hip"]));
        return [model, Cmd_ofMsg(new Msg(0, getAdjective_1()))];
    }
    else {
        const a = msg.fields[0];
        return [new Model(a), Cmd_none()];
    }
}

export function view() {
    const patternInput = Store_makeElmish(init, update, (value) => {
    })();
    const model_1 = patternInput[0];
    const dispatch = patternInput[1];
    return BulmaEngine$1__hero_BB573A(bulma, [HeroModifiersEngine$1__get_isFullheight(hero), style([CssEngine$1__backgroundColor_Z721C83C5(Css, "#c8f7c5"), CssEngine$1__get_cursorPointer(Css)]), onClick((_arg) => {
        dispatch(new Msg(1));
    }, empty()), BulmaEngine$1__heroBody_BB573A(bulma, [TextModifiersEngine$1__get_hasTextCentered(text), BulmaEngine$1__container_BB573A(bulma, [BulmaEngine$1__columns_BB573A(bulma, [BulmaEngine$1__column_BB573A(bulma, [ColumnModifiersEngine$1__get_is6(column), ColumnModifiersEngine$1__get_isOffset3(column), TitleEngine$1__h1_BB573A(BulmaEngine$1__get_title(bulma), [BindApi_Bind_fragment(Store_map(getAdjective, model_1), (a) => HtmlEngine$1__text_Z721C83C5(Html, `Sutil is ${a}!`))]), SubtitleEngine$1__h3_BB573A(BulmaEngine$1__get_subtitle(bulma), [HtmlEngine$1__text_Z721C83C5(Html, "For examples and documentation visit "), HtmlEngine$1__a_BB573A(Html, [AttrEngine$1__href_Z721C83C5(Attr$, "https://sutil.dev"), HtmlEngine$1__text_Z721C83C5(Html, "sutil.dev")])])])])])])]);
}

mountElement("sutil-app", view());

