import type { Day } from './types';

export const DAYS: Day[] = [
  {
    id: 'd1',
    label: 'Día 1',
    focus: 'Handstand + Empuje',
    ex: [
      {
        id: 'kick',
        name: 'Kick-ups a pared',
        target: '5 × 3 intentos',
        type: 'reps',
        equip: ['wall'],
        hw: {
          c: [
            'Manos a un palmo de la pared, dedos abiertos',
            'Mira entre tus manos, no al frente',
            'Patada controlada con una pierna, la otra la sigue',
            'Brazos rectos y hombros empujando siempre',
          ],
          y: 'kick up to handstand wall tutorial',
        },
        alt: [
          {
            id: 'kick_free',
            name: 'Kick-ups libres (buscar equilibrio)',
            target: '5 × 3 intentos',
            hw: {
              c: [
                'Sin pared: patada suave, no tan fuerte',
                'Busca el punto de balance, aguanta 1-2 s',
                'Sal de lado si te pasas, no en arco',
              ],
              y: 'handstand kick up freestanding beginner',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'ctw',
        name: 'Chest-to-wall hold',
        target: '4 × 20–40 s',
        type: 'hold',
        skill: 'handstand',
        equip: ['wall'],
        hw: {
          c: [
            'Sube gateando con el pecho hacia la pared',
            'Cadera sobre hombros, cuerpo en línea recta',
            'Aprieta glúteos y abdomen, costillas metidas',
            'Empuja el suelo (elevación de hombros)',
          ],
          y: 'chest to wall handstand hold tutorial',
        },
        alt: [
          {
            id: 'ctw_free',
            name: 'Handstand libre (holds cortos)',
            target: '4 × 15–30 s',
            hw: {
              c: [
                'Mirada al suelo entre las manos',
                'Corrige con las yemas de los dedos',
                'Cuerpo apretado como una tabla',
              ],
              y: 'freestanding handstand hold beginner',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'wall',
        name: 'Wall hold (alineación)',
        target: '3 × 30 s',
        type: 'hold',
        equip: ['wall'],
        hw: {
          c: [
            'Espalda a la pared, talones apoyados',
            'Camina las manos hacia la pared para alinear',
            'Costillas metidas, sin arquear la espalda',
          ],
          y: 'back to wall handstand alignment',
        },
      },
      {
        id: 'pike',
        name: 'Pike push-ups',
        target: '4 × 6–10',
        type: 'reps',
        equip: ['floor'],
        hw: {
          c: [
            'Cadera arriba en V invertida',
            'Baja la corona de la cabeza hacia el suelo',
            'Codos a unos 45°, no abiertos del todo',
          ],
          y: 'pike push up tutorial form',
        },
      },
      {
        id: 'dip',
        name: 'Fondos / dips',
        target: '4 × 8–12',
        type: 'reps',
        equip: ['dipbar'],
        hw: {
          c: ['Hombros abajo, lejos de las orejas', 'Baja hasta ~90° de codo', 'Ligera inclinación al frente'],
          y: 'parallel bar dips proper form',
        },
        alt: [
          {
            id: 'dip_low',
            name: 'Fondos en barra baja / banco',
            target: '4 × 8–12',
            hw: {
              c: ['Manos al borde, dedos al frente', 'Codos hacia atrás, no afuera', 'Baja controlado hasta 90°'],
              y: 'bench dips proper form',
            },
            equip: ['lowbar'],
          },
          {
            id: 'dip_dia',
            name: 'Flexiones diamante',
            target: '4 × 10–15',
            hw: {
              c: ['Manos en diamante bajo el pecho', 'Codos pegados al cuerpo', 'Cuerpo recto, core firme'],
              y: 'diamond push up form',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'plean',
        name: 'Pseudo planche lean',
        target: '3 × 15–20 s',
        type: 'hold',
        equip: ['floor'],
        hw: {
          c: [
            'Manos a la altura de la cadera, dedos afuera/atrás',
            'Inclínate al frente hasta sentir tensión en hombros',
            'Escápulas protraídas (empuja el suelo lejos)',
          ],
          y: 'pseudo planche lean tutorial',
        },
      },
      {
        id: 'press',
        name: 'Press de hombro (pesas)',
        target: '3 × 12',
        type: 'reps',
        equip: ['weights'],
        hw: {
          c: [
            'Core firme, no arquees la lumbar',
            'Sube hasta bloquear codos arriba',
            'Baja controlado a la altura de las orejas',
          ],
          y: 'dumbbell shoulder press form',
        },
        alt: [
          {
            id: 'press_pike',
            name: 'Pike push-ups elevadas',
            target: '3 × 8–12',
            hw: {
              c: [
                'Pies sobre una superficie elevada',
                'Cadera bien arriba para cargar hombros',
                'Corona al suelo, codos a 45°',
              ],
              y: 'elevated pike push up',
            },
            equip: ['floor'],
          },
        ],
      },
    ],
  },
  {
    id: 'd2',
    label: 'Día 2',
    focus: 'Tracción + Front lever + Core',
    ex: [
      {
        id: 'hang',
        name: 'Dead hang (colgado)',
        target: '3 × 20–30 s',
        type: 'hold',
        equip: ['pullbar'],
        hw: {
          c: ['Agarre firme, pulgares alrededor', 'Hombros activos: encoge un poco y sostén', 'Respira, relaja el resto del cuerpo'],
          y: 'active dead hang tutorial',
        },
      },
      {
        id: 'tfl',
        name: 'Tuck front lever hold',
        target: '5 × 10–15 s',
        type: 'hold',
        skill: 'frontlever',
        equip: ['pullbar'],
        hw: {
          c: [
            'Colgado, retrae y deprime las escápulas',
            'Lleva rodillas al pecho y sube la cadera',
            'Tira de la barra hacia tu cadera (brazos rectos)',
            'Busca cuerpo horizontal, espalda paralela al suelo',
          ],
          y: 'tuck front lever tutorial progression',
        },
        alt: [
          {
            id: 'tfl_ring',
            name: 'Tuck front lever en anillas',
            target: '5 × 10–15 s',
            hw: {
              c: [
                'Anillas firmes, gira los pulgares al frente',
                'Mismo tuck: rodillas al pecho, cadera arriba',
                'Controla la inestabilidad extra de las anillas',
              ],
              y: 'tuck front lever rings',
            },
            equip: ['rings'],
          },
        ],
      },
      {
        id: 'row',
        name: 'Remo invertido',
        target: '4 × 8–12',
        type: 'reps',
        equip: ['lowbar'],
        hw: {
          c: ['Cuerpo recto como tabla, talones apoyados', 'Tira del pecho hacia la barra', 'Aprieta escápulas arriba, baja controlado'],
          y: 'inverted row proper form',
        },
        alt: [
          {
            id: 'row_bar',
            name: 'Remo australiano (barra a la cadera)',
            target: '4 × 8–12',
            hw: {
              c: ['Barra a la altura de la cadera', 'Cuerpo recto, pecho a la barra', 'Más horizontal = más difícil'],
              y: 'australian pull up form',
            },
            equip: ['pullbar'],
          },
          {
            id: 'row_wt',
            name: 'Remo con pesa',
            target: '4 × 8–12',
            hw: {
              c: ['Bisagra de cadera, espalda recta', 'Lleva la pesa a la cadera, codo cerca', 'Aprieta la escápula al final'],
              y: 'single arm dumbbell row form',
            },
            equip: ['weights'],
          },
        ],
      },
      {
        id: 'pull',
        name: 'Dominadas',
        target: '4 × máx',
        type: 'reps',
        equip: ['pullbar'],
        hw: {
          c: ['Escápulas abajo antes de tirar', 'Pecho arriba, barbilla sobre la barra', 'Sin balanceo, baja hasta extender'],
          y: 'pull up proper form beginner',
        },
      },
      {
        id: 'hollow',
        name: 'Hollow body hold',
        target: '4 × 20–40 s',
        type: 'hold',
        equip: ['floor'],
        hw: {
          c: ['Lumbar pegada al suelo (sin hueco)', 'Brazos y piernas extendidos, hombros arriba', 'Aprieta el abdomen todo el tiempo'],
          y: 'hollow body hold tutorial',
        },
      },
      {
        id: 'arch',
        name: 'Arch / superman hold',
        target: '3 × 20 s',
        type: 'hold',
        equip: ['floor'],
        hw: {
          c: ['Boca abajo, brazos al frente', 'Eleva pecho y piernas a la vez', 'Aprieta glúteos, mira al suelo'],
          y: 'superman hold exercise form',
        },
      },
    ],
  },
  {
    id: 'd3',
    label: 'Día 3',
    focus: 'Movilidad · descanso activo',
    mobility: [
      { t: '5 min', d: 'Muñecas', s: 'Flexión/extensión, círculos, apoyo progresivo — base del handstand' },
      { t: '5 min', d: 'Hombros', s: 'Dislocates con banda/palo, flexión de hombro en pared' },
      { t: '5 min', d: 'Compresión de cadera', s: 'Pica sentado, buenos días con isquios — clave para L-sit' },
      { t: '5 min', d: 'Columna', s: 'Gato-camello, rotaciones torácicas' },
    ],
  },
  {
    id: 'd4',
    label: 'Día 4',
    focus: 'L-sit + Piernas + Core',
    ex: [
      {
        id: 'squat',
        name: 'Sentadilla con peso',
        target: '4 × 8–12',
        type: 'reps',
        equip: ['weights'],
        hw: {
          c: ['Pies al ancho de hombros', 'Rodillas siguen la punta de los pies', 'Baja controlado, pecho arriba'],
          y: 'goblet squat form',
        },
        alt: [
          {
            id: 'squat_bw',
            name: 'Sentadilla búlgara / progresión pistol',
            target: '4 × 8–12 c/lado',
            hw: {
              c: ['Pie trasero elevado en un banco', 'Baja recto sobre la pierna de adelante', 'Controla el equilibrio, torso erguido'],
              y: 'bulgarian split squat form',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'rdl',
        name: 'Peso muerto rumano',
        target: '3 × 10',
        type: 'reps',
        equip: ['weights'],
        hw: {
          c: ['Bisagra de cadera, no sentadilla', 'Espalda recta, pesas cerca de las piernas', 'Siente el estiramiento en isquios'],
          y: 'romanian deadlift dumbbell form',
        },
        alt: [
          {
            id: 'rdl_bw',
            name: 'Puente a una pierna / nordic asistido',
            target: '3 × 10 c/lado',
            hw: {
              c: ['Puente: una pierna, sube la cadera y aprieta glúteo', 'Nordic: baja lento controlando con isquios', 'No arquees la lumbar'],
              y: 'single leg glute bridge form',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'lunge',
        name: 'Zancadas',
        target: '3 × 10 c/lado',
        type: 'reps',
        equip: ['floor'],
        hw: {
          c: ['Paso largo, torso recto', 'Rodilla trasera baja hacia el suelo', 'Empuja con el talón de adelante'],
          y: 'reverse lunge form',
        },
      },
      {
        id: 'lsit',
        name: 'Tuck L-sit hold',
        target: '5 × 10–20 s',
        type: 'hold',
        skill: 'lsit',
        equip: ['floor'],
        hw: {
          c: ['Manos al lado de la cadera, empuja el suelo', 'Deprime los hombros (súbete del suelo)', 'Eleva la cadera y encoge las rodillas al pecho'],
          y: 'tuck l sit progression floor',
        },
        alt: [
          {
            id: 'lsit_bar',
            name: 'L-sit en barras paralelas',
            target: '5 × 10–20 s',
            hw: {
              c: ['Brazos rectos y bloqueados en las barras', 'Hombros abajo, no encogidos', 'Rodillas al pecho, sube la cadera'],
              y: 'l sit parallel bars tutorial',
            },
            equip: ['dipbar'],
          },
        ],
      },
      {
        id: 'comp',
        name: 'Compresión activa / leg raises',
        target: '3 × 10–15',
        type: 'reps',
        equip: ['floor'],
        hw: {
          c: ['Lumbar pegada al suelo', 'Sube piernas rectas sin impulso', 'Baja controlado, no dejes caer'],
          y: 'lying leg raises form',
        },
        alt: [
          {
            id: 'comp_hang',
            name: 'Elevaciones de piernas colgado',
            target: '3 × 8–12',
            hw: {
              c: ['Colgado con hombros activos', 'Sube las rodillas o piernas sin balanceo', 'Controla la bajada'],
              y: 'hanging leg raises form',
            },
            equip: ['pullbar'],
          },
        ],
      },
      {
        id: 'hs4',
        name: 'Handstand (práctica corta)',
        target: '5 min de holds',
        type: 'hold',
        skill: 'handstand',
        equip: ['wall'],
        hw: {
          c: ['Repasa alineación contra la pared', 'Series cortas y frescas, calidad > cantidad', 'Trabaja el empuje de hombros'],
          y: 'handstand practice routine wall',
        },
        alt: [
          {
            id: 'hs4_free',
            name: 'Handstand libre (práctica corta)',
            target: '5 min de intentos',
            hw: {
              c: ['Kick-ups suaves buscando balance', 'Corrige con los dedos', 'Sal de lado si te pasas'],
              y: 'freestanding handstand practice',
            },
            equip: ['floor'],
          },
        ],
      },
    ],
  },
  {
    id: 'd5',
    label: 'Día 5',
    focus: 'Skills integrados + Movilidad',
    ex: [
      {
        id: 'balance',
        name: 'Práctica de balance libre',
        target: '10 min',
        type: 'hold',
        skill: 'handstand',
        equip: ['floor'],
        hw: {
          c: ['Mira al suelo entre las manos', 'Micro-ajustes con las yemas de los dedos', 'Si caes al frente, presiona con las puntas'],
          y: 'handstand balance finger tips tutorial',
        },
      },
      {
        id: 'lsit5',
        name: 'L-sit progresión',
        target: '4 × máx',
        type: 'hold',
        skill: 'lsit',
        equip: ['floor'],
        hw: {
          c: ['Avanza: tuck → una pierna → L-sit completo', 'Hombros abajo siempre', 'Compresión activa de la cadera'],
          y: 'l sit progression steps',
        },
        alt: [
          {
            id: 'lsit5_bar',
            name: 'L-sit en barras (progresión)',
            target: '4 × máx',
            hw: {
              c: ['Brazos bloqueados en las barras', 'Sube el nivel: tuck → single → full', 'Hombros deprimidos'],
              y: 'l sit bars progression',
            },
            equip: ['dipbar'],
          },
        ],
      },
      {
        id: 'flprep',
        name: 'Front lever prep escapular',
        target: '4 × 8',
        type: 'reps',
        equip: ['pullbar'],
        hw: {
          c: ['Colgado con brazos rectos', 'Deprime y retrae las escápulas (sube el cuerpo sin doblar codos)', 'Baja controlado, repite'],
          y: 'scapular pull ups tutorial',
        },
        alt: [
          {
            id: 'flprep_floor',
            name: 'Arch + retracción escapular en suelo',
            target: '4 × 20 s',
            hw: {
              c: ['Boca abajo, brazos en Y/T', 'Retrae escápulas y eleva el pecho', 'Aprieta glúteos'],
              y: 'scapular retraction prone floor',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'core5',
        name: 'Hollow + arch (superset)',
        target: '3 rondas',
        type: 'hold',
        equip: ['floor'],
        hw: {
          c: ['Alterna hollow (boca arriba) y arch (boca abajo)', 'Mantén tensión, sin descanso entre los dos', '20-30 s cada uno por ronda'],
          y: 'hollow body arch superset',
        },
      },
    ],
  },
];
