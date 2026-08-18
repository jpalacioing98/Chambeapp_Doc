# AgentsWorkFlows (AUP)

Configuracion de OpenCode para un equipo de agentes basado en la metodologia **Agile Unified Process (AUP)**. Los agentes y sus permisos (incluido el uso de skills por rol) se definen en `opencode.json`.

## Mapa AUP -> Agentes y skills por rol

| Agente (rol)          | Disciplina AUP            | Skills asignadas                                                                 |
|-----------------------|---------------------------|----------------------------------------------------------------------------------|
| `coordinator`         | Orquestacion (primary)    | find-skills, software-engineer, requirements-engineering                         |
| `architect`           | Model                     | requirements-engineering, plantuml-diagram-generator, plantuml-ascii, software-engineer |
| `backend`             | Implementation (backend)  | flask-api-development, python-testing-patterns, software-engineer                |
| `frontend`            | Implementation (frontend) | vercel-react-best-practices, ui-ux-pro-max, frontend-design, impeccable, emil-design-eng, animate, animation-vocabulary, find-animation-opportunities, color-expert, sleek-design-mobile-apps, software-engineer |
| `qa`                  | Test                      | python-testing-patterns, vercel-react-best-practices, software-engineer         |
| `devops`              | Deployment                | software-engineer                                                                |
| `release-manager`     | Configuration Management  | software-engineer                                                                |
| `product-owner`       | Project Management        | requirements-engineering, business-analyst, find-skills                         |
| `tooling`             | Environment               | customize-opencode, software-engineer                                           |
| `docs`                | Documentacion (soporte)   | api-documentation-generator, requirements-engineering, software-engineer        |
| `reasoner`            | Razonamiento (MiMo)       | requirements-engineering, business-analyst, plantuml-diagram-generator, plantuml-ascii, find-skills, software-engineer |

Cada agente tiene en `opencode.json` un `permission.skill` que solo permite las skills de su rol (`"*": "deny"` para el resto).

## Estructura

- `opencode.json` — ajustes globales + definicion de los 11 agentes y sus skills por rol.
- `prompts/` — archivo `.txt` con el prompt de cada agente, referenciado via `{file:./prompts/<agente>.txt}`.
- `skills/` — las 20 skills de `SKILLS.md` copiadas localmente (listas para usar como `OPENCODE_CONFIG_DIR`).

## Activacion

```powershell
$env:OPENCODE_CONFIG_DIR = "Doc/AgentsWorkFlows"
opencode
```

## Integracion con claude-mem (memoria persistente y ahorro de tokens)

[claude-mem](https://github.com/thedotmack/claude-mem) es un plugin que da memoria persistente entre sesiones y comprime el contexto, reduciendo el uso de tokens (~10–18x). **OpenCode es un IDE soportado oficialmente**, por lo que se integra de forma nativa.

Instalacion (detecta OpenCode automaticamente):

```bash
npx claude-mem install
```

En el paso de seleccion de IDEs marca **OpenCode** (puedes marcar Claude Code y OpenCode a la vez). El installer:
- Copia los plugin files al directorio de marketplace de OpenCode y registra los hooks.
- Arranca el worker service (memoria + compresion).
- En nuevas sesiones de OpenCode inyecta contexto de sesiones previas.

Alternativa por marketplace de plugins (dentro de OpenCode):

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

Notas:
- Requisitos: Node >= 20, Bun >= 1, `uv` (auto-instalados por el installer).
- Datos en `~/.claude-mem/`.
- No usar `npm install -g claude-mem`: solo instala el SDK, no registra hooks ni el worker.

## Integracion con OmniRoute (gateway gratuito de modelos)

[OmniRoute](https://github.com/diegosouzapw/OmniRoute) es un AI gateway open-source, OpenAI-compatible, con auto-fallback y 19 estrategias de enrutamiento. Expone un unico endpoint y permite usar cuentas/planes gratuitos de muchos proveedores (Claude, GPT, Gemini, GLM, MiniMax, etc.) desde OpenCode, lo que reduce tokens/costo al enrutar al modelo mas barato o disponible.

OpenCode se integra via el helper oficial `@omniroute/opencode-provider`, que genera una entrada de provider valida para `opencode.json` (delega al runtime `@ai-sdk/openai-compatible`).

Paso 1 — generar el provider (helper oficial):
```bash
npx @omniroute/opencode-provider
```
Esto imprime/escribe el bloque `provider.omniroute` listo para pegar en `opencode.json`.

Paso 2 — o bien, configuracion manual (plantilla; confirma la `baseURL` en la doc de OmniRoute):
```json
"provider": {
  "omniroute": {
    "name": "OmniRoute",
    "options": {
      "baseURL": "https://omniroute.online/v1",
      "apiKey": "{env:OMNIROUTE_API_KEY}"
    }
  }
}
```
Luego los agentes pueden usar `omniroute/<model-id>` en su campo `model`.

Notas:
- Requiere una API key de OmniRoute (`OMNIROUTE_API_KEY`).
- Es complementario a claude-mem: OmniRoute enruta al modelo mas barato/disponible y claude-mem comprime el contexto.
- Guia: https://codewtf.com/connect-omniroute-with-opencode/
