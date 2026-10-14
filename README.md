# Análisis Económicos

Análisis de la economía argentina con datos oficiales, que se actualizan solos todos los días.

| Página | Qué muestra |
|---|---|
| **Mirada larga** (`docs/historia.html`) | Inflación por gobierno desde 2003: Kirchner, CFK I y II, Macri, Alberto Fernández y Milei. Serie oficial del INDEC empalmada, con el IPC Provincias de CIFRA-CTA como estimación alternativa |
| **Universidades y Ley 27.795** (`docs/universidades.html`) | Recorrido judicial de la Ley de Financiamiento Universitario, días de incumplimiento, cumplimiento por artículo, art. 9 y salario nodocente real contra la inflación |

Borrador. Las dos páginas nacieron en el [tablero de MECOPOL](https://github.com/LautaroEGonzalez/Tablero-Mecopol) y se mudaron acá.

## Cómo funciona

```
API de datos.gob.ar ──► scripts/historia.py ──────► docs/data/historia.json ──────► docs/historia.html
fuentes/*.csv ─────────► scripts/universidades.py ─► docs/data/universidades.json ─► docs/universidades.html
                         (GitHub Action, todos los días)                             (GitHub Pages)
```

| Archivo | Qué es |
|---|---|
| `scripts/comun.py` | Acceso a la API de series de datos.gob.ar y utilidades compartidas |
| `scripts/historia.py` | Arma la serie larga 2002–hoy y la inflación de cada gobierno |
| `scripts/universidades.py` | Hechos de la ley, salario nodocente real y financiamiento de Presupuesto Abierto (este último todavía no se muestra) |
| `fuentes/` | Lo que no está en la API, cada dato con su fuente. Ver `fuentes/LEEME.md` |
| `docs/` | El sitio. Los JSON de `docs/data/` los escribe la Action, no se tocan a mano |
| `.github/workflows/actualizar.yml` | La tarea programada |

Si la API falla, el script correspondiente corta con error y **no pisa los datos anteriores**: la página sigue con la última versión buena. El motivo aparece en las anotaciones de la corrida, en la pestaña *Actions*.

## Tareas de mantenimiento

| Cuándo | Qué hacer |
|---|---|
| El INDEC publica el IPC y la API no lo cargó | Agregar el mes en `fuentes/ipc_publicado.csv` |
| Hay un aumento salarial universitario | Agregar una fila en `fuentes/salario_nodocente.csv` |
| Hay un fallo, apelación o acuerdo nuevo | Agregar una fila `crono` en `fuentes/universidades_fuentes.csv` y actualizar `situacion` |

Todo se puede editar desde la web de GitHub, con el lápiz de cada archivo. Al guardar, la Action corre sola.
