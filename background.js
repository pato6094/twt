'use strict';

// Manifest V3 service worker compatible background script
chrome.runtime.onInstalled.addListener(() => {
  setupDeclarativeNetRequestRules();
});

async function setupDeclarativeNetRequestRules() {
  // Remove old rules first
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map(rule => rule.id);

  if (existingRuleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds
    });
  }

  // Add new rules
  const rules = [
    // Rule 1: Add Origin and Referer headers for requests from extension
    {
      id: 1,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          { header: 'Origin', operation: 'set', value: 'https://www.twitch.tv' },
          { header: 'Referer', operation: 'set', value: 'https://www.twitch.tv/' }
        ]
      },
      condition: {
        urlFilter: '*://*.twitch.tv/*',
        initiatorDomains: [chrome.runtime.id],
        resourceTypes: ['xmlhttprequest']
      }
    },
    {
      id: 2,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          { header: 'Origin', operation: 'set', value: 'https://www.twitch.tv' },
          { header: 'Referer', operation: 'set', value: 'https://www.twitch.tv/' }
        ]
      },
      condition: {
        urlFilter: '*://*.ttvnw.net/*',
        initiatorDomains: [chrome.runtime.id],
        resourceTypes: ['xmlhttprequest']
      }
    },
    {
      id: 3,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          { header: 'Origin', operation: 'set', value: 'https://www.twitch.tv' },
          { header: 'Referer', operation: 'set', value: 'https://www.twitch.tv/' }
        ]
      },
      condition: {
        urlFilter: '*://*.jtvnw.net/*',
        initiatorDomains: [chrome.runtime.id],
        resourceTypes: ['xmlhttprequest']
      }
    },
    // Rule 4-7: Remove X-Frame-Options and CSP headers for chat embeds
    {
      id: 4,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'X-Frame-Options', operation: 'remove' },
          { header: 'Content-Security-Policy', operation: 'remove' }
        ]
      },
      condition: {
        urlFilter: 'https://www.twitch.tv/popout/*/chat*',
        resourceTypes: ['sub_frame']
      }
    },
    {
      id: 5,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'X-Frame-Options', operation: 'remove' },
          { header: 'Content-Security-Policy', operation: 'remove' }
        ]
      },
      condition: {
        urlFilter: 'https://www.twitch.tv/embed/*/chat*',
        resourceTypes: ['sub_frame']
      }
    },
    {
      id: 6,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'X-Frame-Options', operation: 'remove' },
          { header: 'Content-Security-Policy', operation: 'remove' }
        ]
      },
      condition: {
        urlFilter: 'https://www.twitch.tv/*/chat*',
        resourceTypes: ['sub_frame']
      }
    },
    {
      id: 7,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'X-Frame-Options', operation: 'remove' },
          { header: 'Content-Security-Policy', operation: 'remove' }
        ]
      },
      condition: {
        urlFilter: 'https://www.twitch.tv/popout/*',
        resourceTypes: ['sub_frame']
      }
    }
  ];

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules
  });
}