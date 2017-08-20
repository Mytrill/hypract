import { get } from 'dot-prop-immutable';

/*
 * 
 * Code extracted/adapted from t.js
 * See https://github.com/jasonmoo/t.js
 * 
 * Extract from the code there:
 * 
 * @author  Jason Mooberry <jasonmoo@me.com>
 * @license MIT
 * @version 0.1.0
 * 
 */

const blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g
const valregex = /\{\{([=%])(.+?)\}\}/g;

const scrub = (val) => {
  return new Option(val).innerHTML.replace(/"/g,"&quot;");
}

export const render = (fragment: string, vars: any): string => {
  // early exit to prevent
  if ( !fragment || !fragment.includes('{{')) {
    return fragment;
  }

  const _key = vars._key;
  const _val = vars._val;
  try {
    return fragment
    .replace(blockregex, function(_, __, meta, key, inner, if_true, has_else, if_false) {

      var val = get(vars,key), temp = '', i;

      if (!val) {
        // handle if not
        if (meta == '!') {
          return render(inner, vars);
        }
        // check for else
        if (has_else) {
          return render(if_false, vars);
        }

        return '';
      }

      // regular if
      if (!meta) {
        return render(if_true, vars);
      }

      // process array/obj iteration
      if (meta == '@') {
        // store any previous vars
        // reuse existing vars
        _ = vars._key;
        __ = vars._val;
        for (i in val) {
          if (val.hasOwnProperty(i)) {
            vars._key = i;
            vars._val = val[i];
            temp += render(inner, vars);
          }
        }
        vars._key = _;
        vars._val = __;
        return temp;
      }

    })
    .replace(valregex, function(_, meta, key) {
      var val = get(vars,key);

      if (val || val === 0) {
        return meta == '%' ? scrub(val) : val;
      }
      return '';
    });

  } finally {
    vars._key = _key;
    vars._val = _val;
  }
};
