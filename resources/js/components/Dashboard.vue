<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">DashBoard Component</div>

                    <div class="card-body">
                        I'm an DashBoard component.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dashboard",
    mounted() {
        console.log("Dashboard Component mounted.");
    }
};
</script>
