<script setup>
    import "@nightingale-elements/nightingale-manager";  // Import defines the custom element
</script>

<template>
    <nightingale-manager id="mgr">
        <table>
            <tbody>
                <slot>
                    <tr><td colspan="2">No tracks yet</td></tr>
                </slot>
            </tbody>
        </table>
    </nightingale-manager>
</template>
