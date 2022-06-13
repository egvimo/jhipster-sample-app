package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc29Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc29.class);
        Abc29 abc291 = new Abc29();
        abc291.setId(1L);
        Abc29 abc292 = new Abc29();
        abc292.setId(abc291.getId());
        assertThat(abc291).isEqualTo(abc292);
        abc292.setId(2L);
        assertThat(abc291).isNotEqualTo(abc292);
        abc291.setId(null);
        assertThat(abc291).isNotEqualTo(abc292);
    }
}
