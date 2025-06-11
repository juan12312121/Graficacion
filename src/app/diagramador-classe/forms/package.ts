import * as joint from 'jointjs';
import { claseHeader } from '../../shared-class-components/header-clase';
import { claseBody } from '../../shared-class-components/body-clase';

import { obtenerPuertos } from '../../shared-class-components/portsUML';
import { crearGruposDePuertos } from '../../shared-class-components/portsUML';

const header = claseHeader('[package X]',{
    fill:'#ffffff',
    textColor: '#000',
    stroke:'#ffffff'
});

const body = claseBody(' ',{
    fill:'#f8dcff'}


);





const markup = [...header.markup, ...body.markup] 
const attrs = {...header.attrs, ...body.attrs}

export const PackageUML = joint.dia.Element.define(
     'custom.Package',
    {        
        size: {width: 200, height: 150},
        attrs,
        ports: {
            groups:crearGruposDePuertos({stroke:'#df76fa'}),
            items: obtenerPuertos()
        }
    }, 
    {
        markup,
        portMarkup: [{
            tagName: 'circle',
            selector: 'portBody'
            }]
        
    }
);
