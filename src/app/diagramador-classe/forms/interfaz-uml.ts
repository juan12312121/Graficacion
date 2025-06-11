import * as joint from 'jointjs';
import { claseHeader } from '../../shared-class-components/header-clase';
import { claseBody } from '../../shared-class-components/body-clase';
import { claseFooter } from '../../shared-class-components/footer-clase';
import { obtenerPuertos } from '../../shared-class-components/portsUML';
import { crearGruposDePuertos } from '../../shared-class-components/portsUML';


const header = claseHeader('<<Interfaz>>',{fill:'#f63535'});

const body = claseBody('- id ',{
    fill:'#ffa4a4',
    textColor:'#ffffff',
    stroke:'#000000'
});

const footer = claseFooter('+ login(): void\n+ logout(): void', 
    {fill: '#ef7575'});

const markup = [...header.markup, ...body.markup, ...footer.markup] 
const attrs = {...header.attrs, ...body.attrs, ...footer.attrs}
export const InterfazUML = joint.dia.Element.define( 'custom.Interfaz',{
    size: {width: 200, height: 150},
    attrs,
    ports: {
            groups:crearGruposDePuertos({stroke:'#f54d4d'}),
            items: obtenerPuertos()
        }
    
}, {markup,
    portMarkup: [{
            tagName: 'circle',
            selector: 'portBody'
            }]});

