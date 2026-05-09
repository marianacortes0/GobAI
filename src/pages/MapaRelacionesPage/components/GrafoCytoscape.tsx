import { useEffect, useMemo, useRef } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent'
import navigator from 'cytoscape-navigator'
import type { Core, EventObject } from 'cytoscape'
import { transformToCytoscape } from '@/utils/transform-grafo'
import { INITIAL_ZOOM_BOOST, layoutConfig, stylesheet } from '@/utils/cytoscape-config'
import type { GrafoData, NodoGrafo } from '@/types/relacion.types'

let registrado = false
function registrarExtensiones() {
  if (registrado) return
  cytoscape.use(coseBilkent)
  try {
    cytoscape.use(navigator)
  } catch {
    // navigator es opcional
  }
  registrado = true
}

interface Props {
  data: GrafoData
  onNodeClick: (nodo: NodoGrafo) => void
  onCyReady?: (cy: Core) => void
}

export function GrafoCytoscape({ data, onNodeClick, onCyReady }: Props) {
  registrarExtensiones()

  const cyRef = useRef<Core | null>(null)
  const elements = useMemo(() => transformToCytoscape(data), [data])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.elements().remove()
    cy.add(elements)
    const layout = cy.layout(layoutConfig)
    layout.one('layoutstop', () => {
      cy.zoom({ level: cy.zoom() * INITIAL_ZOOM_BOOST, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } })
      cy.center()
    })
    layout.run()
  }, [elements])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    const handleTap = (evt: EventObject) => {
      const node = evt.target
      const d = node.data()
      onNodeClick({
        id: d.id,
        label: d.label,
        tipo: d.tipo,
        nivel_riesgo: d.nivel_riesgo,
        es_central: d.es_central,
        metadata: d.metadata,
      })
      cy.elements().addClass('faded')
      node.closedNeighborhood().removeClass('faded')
    }
    const handleBgTap = (evt: EventObject) => {
      if (evt.target === cy) cy.elements().removeClass('faded')
    }

    cy.on('tap', 'node', handleTap)
    cy.on('tap', handleBgTap)
    return () => {
      cy.off('tap', 'node', handleTap)
      cy.off('tap', handleBgTap)
    }
  }, [onNodeClick])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    const cyAny = cy as unknown as { navigator?: (opts: object) => { destroy: () => void } }
    if (typeof cyAny.navigator !== 'function') return
    const container = document.getElementById('mapa-relaciones-minimapa')
    if (!container) return
    container.innerHTML = ''
    try {
      const nav = cyAny.navigator({
        container,
        viewLiveFramerate: 0,
        thumbnailEventFramerate: 30,
        dblClickDelay: 200,
      })
      return () => nav?.destroy?.()
    } catch {
      return
    }
  }, [])

  return (
    <CytoscapeComponent
      elements={elements}
      stylesheet={stylesheet as never}
      layout={layoutConfig as never}
      style={{ width: '100%', height: '100%' }}
      minZoom={0.2}
      maxZoom={3}
      cy={(cy: Core) => {
        if (cyRef.current === cy) return
        cyRef.current = cy
        onCyReady?.(cy)
      }}
    />
  )
}
